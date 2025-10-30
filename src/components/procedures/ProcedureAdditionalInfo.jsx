import PropTypes from 'prop-types';

const ProcedureAdditionalInfo = ({ formData, updateField }) => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                    Yêu cầu điều kiện chung
                </label>
                <textarea
                    value={formData.yeuCauDieuKienChung}
                    onChange={(e) => updateField('yeuCauDieuKienChung', e.target.value)}
                    placeholder="Nhập yêu cầu điều kiện chung..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                    Số quyết định
                </label>
                <input
                    type="text"
                    value={formData.soQuyetDinh}
                    onChange={(e) => updateField('soQuyetDinh', e.target.value)}
                    placeholder="Nhập số quyết định..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </>
    );
};

ProcedureAdditionalInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    updateField: PropTypes.func.isRequired
};

export default ProcedureAdditionalInfo;
