import React from 'react';
import PropTypes from 'prop-types';

const ReusableTable = ({ headers, data, renderRow, emptyMessage = "No records found" }) => {
    return (
        <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-sky-50/50 text-slate-600 font-semibold border-b border-sky-100">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="px-4 py-3 whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-50">
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="hover:bg-sky-50/30 transition-colors">
                                    {renderRow(item, index)}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ReusableTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string
};

export default ReusableTable;
