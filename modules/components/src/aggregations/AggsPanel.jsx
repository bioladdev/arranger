import Location from '#Location';
import { inCurrentSQON } from '#SQONViewer/utils';

import AggsQuery from './AggsQuery';
import TermAggs from './TermAggs/index';

const AggsPanel = ({ index, aggs = [], ...props }) =>
	aggs.length ? (
		<AggsQuery
			aggs={aggs}
			documentType={index}
			render={({ data, loading }) =>
				loading ? (
					'loading'
				) : (
					<div className="remainder">
						{Object.entries(data[index].aggregations).map(([fieldName, data]) => (
							<Location
								key={fieldName}
								render={(search) => (
									<TermAggs
										fieldName={fieldName}
										buckets={data.buckets}
										isActive={(field) =>
											inCurrentSQON({
												currentSQON: (search.filters || {}).content,
												dotFieldName: field.fieldName,
												value: field.value,
											})
										}
										handleFieldClick={(d) => {
											// history.push({
											//   search: stringify({
											//     filters: JSON.stringify({
											//       op: 'and',
											//       content: [
											//         {
											//           op: 'in',
											//           content: {
											//             field: d.field,
											//             value: [d.value],
											//           },
											//         },
											//       ],
											//     }),
											//   }),
											// });
										}}
									/>
								)}
							/>
						))}
					</div>
				)
			}
			{...props}
		/>
	) : null;

export default AggsPanel;
