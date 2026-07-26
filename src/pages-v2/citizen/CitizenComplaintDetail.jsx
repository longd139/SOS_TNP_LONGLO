// ============================================================
// CITIZEN COMPLAINT DETAIL — Chi tiết phản ánh (Citizen view)
// ============================================================
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, MessageSquare, Image, Calendar } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getCategoryById, getNeighborhoodById, getDepartmentById,
  getAttachmentsByComplaint, getAssignmentByComplaint,
  getActionTypeLabel, getTimeRemaining, getUserById,
} from '../../mock/db';
import { StatusBadge, SlaBadge, UrgencyBadge } from '../../mock/components/Badges';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDateOnly(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function CitizenComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaintById, getHistoryByComplaint } = useMock();

  const complaint = getComplaintById(id);
  if (!complaint) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-16 text-center">
        <p className="text-lg font-medium text-gray-500">Không tìm thấy phản ánh</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-blue-600 hover:underline">Quay lại</button>
      </div>
    );
  }

  const history = getHistoryByComplaint(id);
  const publicHistory = history.filter(h => h.isPublic === true);
  const attachments = getAttachmentsByComplaint(id);
  const assignment = getAssignmentByComplaint(id);
  const cat = getCategoryById(complaint.categoryId);
  const nb = getNeighborhoodById(complaint.neighborhoodId);
  const dept = assignment ? getDepartmentById(assignment.departmentId) : null;
  const isCompleted = complaint.status === 'COMPLETED';
  const timeRemaining = complaint.currentDeadline ? getTimeRemaining(complaint.currentDeadline) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ---- 1. Header ---- */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-mono text-blue-700 font-medium">{complaint.code}</p>
          <h1 className="text-lg font-bold text-gray-900 mt-0.5 line-clamp-2">{complaint.title}</h1>
        </div>
      </div>

      {/* ---- 2. Status section ---- */}
      <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={complaint.status} />
          <SlaBadge slaStatus={complaint.slaStatus} />
          <UrgencyBadge urgency={complaint.confirmedUrgency || complaint.citizenUrgency} />
        </div>
        {(complaint.currentDeadline || timeRemaining) && (
          <div className="flex items-center gap-4 text-sm">
            {complaint.currentDeadline && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Hạn: {formatDateOnly(complaint.currentDeadline)}</span>
              </div>
            )}
            {timeRemaining && (
              <div className={`flex items-center gap-1.5 font-medium ${
                complaint.slaStatus === 'OVERDUE' ? 'text-red-600' :
                complaint.slaStatus === 'NEAR_DUE' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{timeRemaining}</span>
              </div>
            )}
          </div>
        )}
        {isCompleted && complaint.completedAt && (
          <p className="text-sm text-gray-500 mt-2">
            Hoàn thành: {formatDate(complaint.completedAt)}
          </p>
        )}
      </div>

      {/* ---- 3. Content section ---- */}
      <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Nội dung phản ánh</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Loại phản ánh:</span>
            <span className="ml-1.5 text-gray-700 font-medium">{cat?.name || '—'}</span>
          </div>
          <div>
            <span className="text-gray-400">Khu phố:</span>
            <span className="ml-1.5 text-gray-700 font-medium">{nb?.name || '—'}</span>
          </div>
          {complaint.address && (
            <div className="sm:col-span-2">
              <span className="text-gray-400">Địa chỉ:</span>
              <span className="ml-1.5 text-gray-700">{complaint.address}</span>
            </div>
          )}
          {(complaint.latitude && complaint.longitude) && (
            <div className="sm:col-span-2 flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-mono">{complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}</span>
            </div>
          )}
        </div>

        {/* Images */}
        {attachments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-gray-400" />
              Hình ảnh đính kèm ({attachments.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {attachments.map(att => (
                <img
                  key={att.id}
                  src={att.fileUrl}
                  alt={att.fileName}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 bg-gray-100"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---- 4. Processing info ---- */}
      {complaint.receivedAt && (
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin xử lý</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {dept && (
              <div>
                <span className="text-gray-400">Đơn vị xử lý:</span>
                <span className="ml-1.5 text-gray-700 font-medium">{dept.name}</span>
              </div>
            )}
            <div>
              <span className="text-gray-400">Ngày tiếp nhận:</span>
              <span className="ml-1.5 text-gray-700">{formatDate(complaint.receivedAt)}</span>
            </div>
            {complaint.currentDeadline && (
              <div>
                <span className="text-gray-400">Hạn hoàn thành dự kiến:</span>
                <span className="ml-1.5 text-gray-700">{formatDateOnly(complaint.currentDeadline)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- 5. Public timeline ---- */}
      {publicHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Tiến trình xử lý</h3>
          <div className="space-y-0">
            {publicHistory.map((entry, idx) => {
              const isLast = idx === publicHistory.length - 1;
              const actor = getUserById(entry.performedBy);
              return (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-white border-2 border-gray-400" />
                    {!isLast && <div className="w-0.5 flex-1 min-h-[1.5rem] bg-gray-300" />}
                  </div>
                  <div className="pb-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      <span className="font-medium text-gray-800">
                        {getActionTypeLabel(entry.actionType)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(entry.performedAt)}
                      </span>
                    </div>
                    {actor && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {actor.fullName}
                        <span className="text-gray-400">
                          {actor.role === 'CITIZEN' ? ' (Người dân)' :
                           actor.role === 'RECEPTION_OFFICER' ? ' (Cán bộ tiếp nhận)' :
                           actor.role === 'PROCESSING_OFFICER' ? ' (Cán bộ xử lý)' :
                           actor.role === 'APPROVER' || actor.role === 'LEADER' ? ' (Lãnh đạo)' : ''}
                        </span>
                      </p>
                    )}
                    {entry.publicNote && (
                      <p className="text-xs text-green-600 mt-0.5 italic">
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        {entry.publicNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- 6. Completion result ---- */}
      {isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Kết quả xử lý
          </h3>
          <p className="text-sm text-gray-700">
            Phản ánh đã được xử lý và hoàn thành
            {complaint.slaStatus === 'COMPLETED_ON_TIME' ? ' đúng hạn.' :
             complaint.slaStatus === 'COMPLETED_LATE' ? ' (trễ hạn).' : '.'}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <SlaBadge slaStatus={complaint.slaStatus} />
          </div>
          {complaint.completedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Ngày hoàn thành: {formatDate(complaint.completedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
