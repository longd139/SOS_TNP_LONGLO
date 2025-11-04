import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { GOVERNMENT_API } from '../../apis/government';
import { COMMITTEE_API } from '../../apis/committee';
import { validateGovernmentForm } from '../../validator/governmentValidator';
import GoogleMapAutocomplete from '../googleMap/GoogleMapAutocomplete';
import { showToast } from '../../utils/toastNotification';

const initialState = {
    idUyBan: '',
    tenCoSo: '',
    diaChi: '',
    soDienThoai: '',
    moTa: '',
    linkGoogleMap: ''
};

const GovernmentFormModal = ({ isOpen, onClose, onCreate }) => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [committees, setCommittees] = useState([]);
    const [loadingCommittees, setLoadingCommittees] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCommittees();
        }
    }, [isOpen]);

    const fetchCommittees = async () => {
        setLoadingCommittees(true);
        try {
            const data = await COMMITTEE_API.getCommittees();
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                setCommittees([data]);
            } else if (Array.isArray(data)) {
                setCommittees(data);
            } else {
                setCommittees([]);
            }
        } catch (error) {
            setCommittees([]);
        } finally {
            setLoadingCommittees(false);
        }
    };

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: null }));
        }
    };

    const handleSubmit = async () => {
        
        const { isValid, errors: validationErrors } = await validateGovernmentForm(form);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const payload = {
                idUyBan: form.idUyBan,
                tenCoSo: form.tenCoSo,
                diaChi: form.diaChi,
                soDienThoai: form.soDienThoai,
                moTa: form.moTa,
                linkGoogleMap: form.linkGoogleMap
            };
            const created = await GOVERNMENT_API.createGovernment(payload);
            showToast.success('Tạo cơ sở dịch vụ công thành công!');
            onCreate && onCreate(created);
            setForm(initialState);
            onClose();
        } catch (err) {
            showToast.error('Có lỗi khi tạo cơ sở. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tạo mới cơ sở dịch vụ công"
            size="md"
            footer={
                <ModalFooter
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText="Tạo"
                    submitDisabled={false}
                    submitLoading={loading}
                />
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 required-label">
                        Mã cơ quan/ủy ban
                    </label>
                    <select
                        value={form.idUyBan}
                        onChange={(e) => updateField('idUyBan', e.target.value)}
                        disabled={loadingCommittees}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.idUyBan ? 'border-red-500' : 'border-gray-300'} ${loadingCommittees ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        <option value="">
                            {loadingCommittees ? 'Đang tải...' : 'Chọn ủy ban'}
                        </option>
                        {committees.map((committee) => (
                            <option key={committee.id} value={committee.id}>
                                {committee.ten_don_vi || committee.tenDonVi || `Ủy ban ${committee.id}`}
                            </option>
                        ))}
                    </select>
                    {errors.idUyBan && <p className="mt-1 text-xs text-red-600">{errors.idUyBan}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 required-label">Tên cơ sở</label>
                    <input
                        type="text"
                        value={form.tenCoSo}
                        onChange={(e) => updateField('tenCoSo', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.tenCoSo ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.tenCoSo && <p className="mt-1 text-sm text-red-600">{errors.tenCoSo}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 required-label">Địa chỉ</label>
                    <input
                        type="text"
                        value={form.diaChi}
                        onChange={(e) => updateField('diaChi', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.diaChi ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.diaChi && <p className="mt-1 text-sm text-red-600">{errors.diaChi}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 required-label">Số điện thoại</label>
                    <input
                        type="text"
                        value={form.soDienThoai}
                        onChange={(e) => updateField('soDienThoai', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.soDienThoai ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.soDienThoai && <p className="mt-1 text-sm text-red-600">{errors.soDienThoai}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                        value={form.moTa}
                        onChange={(e) => updateField('moTa', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.moTa ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.moTa && <p className="mt-1 text-sm text-red-600">{errors.moTa}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Vị trí trên Google Maps
                    </label>
                    <div className="flex items-center gap-2 w-full">
                        {/* <div className="flex-1">
                            <GoogleMapAutocomplete
                                value={form.linkGoogleMap}
                                onChange={(link, address) => {
                                    updateField("linkGoogleMap", link);
                                    if (address && !form.diaChi) updateField("diaChi", address);
                                }}
                                error={errors.linkGoogleMap}
                            />
                        </div>

                        {form.linkGoogleMap && (
                            <a
                                href={form.linkGoogleMap}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm underline hover:text-blue-800 flex-shrink-0"
                            >
                                Xem
                            </a>
                        )} */}
                        <input
                            type="text"
                            value={form.linkGoogleMap}
                            onChange={(e) => updateField('linkGoogleMap', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg ${errors.linkGoogleMap ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                </div>

            </div>
        </BaseModal>
    );
};

GovernmentFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func
};

export default GovernmentFormModal;
