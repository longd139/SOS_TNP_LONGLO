import React from 'react';
import PropTypes from 'prop-types';

const ProcedureRemoveToggle = ({ isRemoved, updateField }) => {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative inline-block w-12 h-6">
                    <input
                        type="checkbox"
                        checked={isRemoved || false}
                        onChange={(e) => updateField('isRemoved', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </div>
                <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                        Xóa thủ tục
                    </span>
                </div>
            </label>
        </div>
    );
};

ProcedureRemoveToggle.propTypes = {
    isRemoved: PropTypes.bool,
    updateField: PropTypes.func.isRequired
};

export default ProcedureRemoveToggle;
