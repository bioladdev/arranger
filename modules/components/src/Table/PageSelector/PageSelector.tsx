import cx from 'classnames';
import {
	useCallback,
	useEffect,
	useState,
	type ChangeEventHandler,
	type FormEventHandler,
	type MouseEventHandler,
} from 'react';

import { TransparentButton } from '#Button/index';
import { useTableContext } from '#Table/helpers/index';
import { useThemeContext } from '#ThemeContext/index';
import { TooltippedForm, TooltippedLI } from '#Tooltip/index';
import { emptyObj } from '#utils/noops';
import useDebounce from '#utils/useDebounce';

import styles from './PageSelector.module.css';
import type { PageSelectorProps } from './types';

const PageSelector = ({
	className: customClassName,
	style: customCSS,
	theme: {
		borderColor: customBorderColor,
		borderErrorColor: customBorderErrorColor,
		borderRadius: customBorderRadius,
		changePageOnTimeout: customChangePageOnTimeout,
		disabledFontColor: customDisabledFontColor,
		fontColor: customFontColor,
		fontSize: customFontSize,
		showTotalPages: customShowTotalPages,
	} = emptyObj,
}: PageSelectorProps) => {
	const [inputHasError, setInputHasError] = useState(false);
	const { currentPage, maxPages, maxResultsWindow, setCurrentPage, total, totalPages } = useTableContext({
		callerName: 'Table - PageSelector',
	});

	const {
		components: {
			Table: {
				PageSelector: {
					borderColor: themeBorderColor,
					borderErrorColor: themeBorderErrorColor,
					borderRadius: themeBorderRadius,
					changePageOnTimeout: themeChangePageOnTimeout = false,
					className: themeClassName,
					style: themeCSS,
					disabledFontColor: themeDisabledFontColor,
					fontColor: themeFontColor,
					fontSize: themeFontSize,
					showTotalPages: themeShowTotalPages,
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'Table - PageSelector' });

	const disabledFontColor = customDisabledFontColor || themeDisabledFontColor;
	const shouldChangeOntimeout = customChangePageOnTimeout || themeChangePageOnTimeout;

	const firstPage = 1;
	const displayPage = currentPage + 1;
	const lastPage = Math.min(maxPages, totalPages);
	const maxResults = maxResultsWindow?.toLocaleString();

	const isFirstPage = displayPage === firstPage;
	const isLastPage = displayPage === lastPage;

	const [currentInput, setCurrentInput] = useState(displayPage?.toString?.());
	const isInputbeyondRange = lastPage && Number(currentInput) > lastPage; // triggers "too large" tooltip

	const debouncedNewPage = useDebounce(currentInput?.length ? Number(currentInput) : displayPage, 1000);

	// handles page change requests, and edge cases
	const attemptToChangePage = useCallback(
		(value: number) => {
			// ensure the are pages to show, and the values is within valid bounds
			const newPageIsInvalid = !(lastPage > 0 && value > 0 && value <= lastPage);

			newPageIsInvalid || setCurrentPage(value - 1);
			// highlight the field if value is invalid
			setInputHasError(newPageIsInvalid);
		},
		[lastPage, setCurrentPage],
	);

	// respond to the arrows (e.g. next, previous)
	const handlePageJump =
		(selected = 1): MouseEventHandler =>
		(event) => {
			if (selected > 0 && selected <= lastPage) {
				setCurrentPage(selected - 1);
			} else {
				console.log('what happened!? selected page:', selected);
			}
		};

	// resets the value in the field if the user leaves it before applying it
	const handlePageInputBlur: ChangeEventHandler<HTMLInputElement> = (event) => {
		setCurrentInput((currentPage + 1).toString());
	};

	// update the value in the field as the user types it
	const handlePageInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const value = event.target.value;

		setCurrentInput(value);
	};

	// Handle when users press enter while the "input" is focused
	const handlePageInputSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event?.preventDefault(); // form submit, prevents refresh

		attemptToChangePage(Number(currentInput));
	};

	// changes page upon debounce timeout, if enabled
	useEffect(() => {
		shouldChangeOntimeout && attemptToChangePage(debouncedNewPage);
	}, [attemptToChangePage, debouncedNewPage, shouldChangeOntimeout]);

	// updates the value in the field if the page is changed outside the component
	useEffect(() => {
		setCurrentInput((currentPage + 1).toString());
	}, [currentPage]);

	const pageSelectorThemeStyle = {
		'--arranger-page-selector-border-radius': customBorderRadius || themeBorderRadius,
		'--arranger-page-selector-disabled-font-color': disabledFontColor,
		'--arranger-page-selector-error-border-color': customBorderErrorColor || themeBorderErrorColor,
		'--arranger-page-selector-font-color': customFontColor || themeFontColor,
		'--arranger-page-selector-font-size': customFontSize || themeFontSize,
		'--arranger-page-selector-input-border-color': customBorderColor || themeBorderColor,
	};

	return (
		<article
			className={cx(styles.pageSelector, customClassName, themeClassName)}
			style={{ ...pageSelectorThemeStyle, ...themeCSS, ...customCSS }}
			role="navigation"
		>
			<ul
				className={styles.list}
				aria-label="Pagination"
			>
				<TooltippedLI>
					{totalPages > 1 && (
						<TransparentButton
							className={cx(styles.navButton, styles.navButtonFirst)}
							disabled={isFirstPage}
							onClick={handlePageJump(firstPage)}
						>
							{'<<'}
						</TransparentButton>
					)}

					{totalPages > 2 && (
						<TransparentButton
							className={styles.navButton}
							disabled={isFirstPage}
							onClick={handlePageJump(displayPage - 1)}
						>
							{'<'}
						</TransparentButton>
					)}
				</TooltippedLI>

				<TooltippedLI>
					<label className={styles.pageLabel}>
						<span className={styles.pageLabelText}>Page</span>

						{
							// is it worth showing an input field?
							totalPages > 2 ? (
								<TooltippedForm
									onSubmit={handlePageInputSubmit}
									theme={{
										tooltipText: isInputbeyondRange
											? `Page ${lastPage} is the last available`
											: `Press "Enter" to go`,
										// either show "enter" instructions on hover, or "too large" regardless of mouse
										tooltipVisibility: isInputbeyondRange ? 'always' : 'hover',
									}}
								>
									<input
										className={styles.pageInput}
										data-error={inputHasError}
										min={firstPage} // there's no page < 1, duh
										max={lastPage}
										name="page-selection-input"
										onChange={handlePageInputChange} // to update the value
										onBlur={handlePageInputBlur} // to reset it if not applied
										type="number"
										value={currentInput}
									/>
								</TooltippedForm>
							) : (
								<span>{total > 0 ? displayPage : '...'}</span>
							)
						}
					</label>

					{
						// do we have more than 1 page?
						totalPages > 1 && (customShowTotalPages || themeShowTotalPages) && (
							<span>{`of ${totalPages}`}</span>
						)
					}
				</TooltippedLI>

				<TooltippedLI
					theme={{
						tooltipAlign: 'top left' as const,
						tooltipText:
							isLastPage &&
							totalPages > lastPage &&
							total > maxResultsWindow &&
							`This table is limited to ${maxResults} results`,
					}}
				>
					{totalPages > 2 && (
						<TransparentButton
							className={styles.navButton}
							disabled={isLastPage}
							onClick={handlePageJump(displayPage + 1)}
						>
							{'>'}
						</TransparentButton>
					)}

					{totalPages > 1 && (
						<TransparentButton
							className={cx(styles.navButton, styles.navButtonLast)}
							disabled={isLastPage}
							onClick={handlePageJump(lastPage)}
						>
							{'>>'}
						</TransparentButton>
					)}
				</TooltippedLI>
			</ul>
		</article>
	);
};

export default PageSelector;
