import PropTypes from 'prop-types';

const ProcedureAdditionalInfo = ({ formData, updateField }) => {
    return (
        <div className="h-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu điều kiện chung
            </label>
            <textarea
                value={formData.yeuCauDieuKienChung}
                onChange={(e) => updateField('yeuCauDieuKienChung', e.target.value)}
                placeholder="Nhập yêu cầu điều kiện chung..."
                className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
        </div>
    );
};

ProcedureAdditionalInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    updateField: PropTypes.func.isRequired
};

export default ProcedureAdditionalInfo;
