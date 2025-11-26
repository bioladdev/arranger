import Location from '#Location.js';
import { inCurrentSQON } from '#SQONViewer/utils.js';

import AggsQuery from './AggsQuery.js';
import TermAggs from './TermAggs/index.js';

interface AggsPanelProps {
	aggs?: any[];
	index: string;
}

const AggsPanel = ({ index, aggs = [], ...props }: AggsPanelProps) =>
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
