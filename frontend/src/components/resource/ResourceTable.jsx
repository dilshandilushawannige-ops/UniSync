import React from 'react';

const ResourceTable = ({ resources, onEdit, onDelete, onStatusToggle }) => {
	const typeClassMap = {
		LAB: 'bg-blue-100 text-blue-700',
		LECTURE_HALL: 'bg-emerald-100 text-emerald-700',
		EQUIPMENT: 'bg-amber-100 text-amber-700',
		MEETING_ROOM: 'bg-pink-100 text-pink-700',
	};

	return (
		<div className="overflow-x-auto rounded-2xl border border-[#D6E5F4] bg-white shadow-sm">
			<table className="min-w-full text-sm">
				<thead className="bg-[#E6F1FB] text-left text-[#0C447C]">
					<tr>
						<th className="px-4 py-3 font-semibold">Name</th>
						<th className="px-4 py-3 font-semibold">Type</th>
						<th className="px-4 py-3 font-semibold">Capacity</th>
						<th className="px-4 py-3 font-semibold">Location</th>
						<th className="px-4 py-3 font-semibold">Status</th>
						<th className="px-4 py-3 font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody>
					{resources.length === 0 ? (
						<tr>
							<td colSpan={6} className="px-4 py-6 text-center text-slate-500">
								No resources found.
							</td>
						</tr>
					) : (
						resources.map((resource) => {
							const nextStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
							return (
								<tr key={resource.id} className="border-t border-[#E6F1FB] transition hover:bg-[#F4F9FF]">
									<td className="px-4 py-3 text-slate-800">{resource.name}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeClassMap[resource.type] || 'bg-slate-100 text-slate-700'}`}>
											{resource.type}
										</span>
									</td>
									<td className="px-4 py-3 text-slate-700">{resource.capacity}</td>
									<td className="px-4 py-3 text-slate-700">{resource.location}</td>
									<td className="px-4 py-3">
										<span
											className={`rounded-full px-3 py-1 text-xs font-semibold ${
												resource.status === 'ACTIVE'
													? 'bg-emerald-100 text-emerald-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{resource.status}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex flex-wrap gap-2">
											<button
												onClick={() => onEdit(resource)}
												className="rounded-md bg-[#185FA5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0C447C]"
											>
												Edit
											</button>
											<button
												onClick={() => onStatusToggle(resource.id, nextStatus)}
												className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
											>
												Toggle Status
											</button>
											<button
												onClick={() => onDelete(resource.id)}
												className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default ResourceTable;
