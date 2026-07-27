// ============================================================
// PAGE C-03 — CitizenComplaintDetail (Citizen view)
// ============================================================
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getCategoryById, getNeighborhoodById, getDepartmentById,
  getAttachmentsByComplaint, getAssignmentByComplaint,
  getActionTypeLabel, getTimeRemaining, getUserById,
} from '../../mock/db';
import { formatDate } from '../../utils/formatDate';
import { StatusBadge, SlaBadge, UrgencyBadge } from '../../mock/components/Badges';

const SECTION_TITLE = 'text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2';
const CARD = 'bg-white rounded-xl p-3 md:p-4 shadow-sm';

export default function CitizenComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaintById, getHistoryByComplaint } = useMock();

  const complaint = getComplaintById(id);

  if (!complaint) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-16 text-center">
        <p className="text-lg font-medium text-gray-500">Khong tim thay phan anh</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-blue-600 hover:underline">Quay lai</button>
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
  const urgency = complaint.confirmedUrgency || complaint.citizenUrgency;

  const timeRemainingColor = !timeRemaining ? 'text-gray-500'
    : complaint.slaStatus === 'OVERDUE' ? 'text-red-600'
    : complaint.slaStatus === 'NEAR_DUE' ? 'text-yellow-600'
    : 'text-green-600';

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">

      {/* ---- Back button + Page title ---- */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lai
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Chi tiet phan anh</h1>
        <p className="text-gray-600 mt-1">{complaint.title}</p>
      </div>

      {/* ---- Status overview ---- */}
      <div className={CARD}>
        <h3 className={SECTION_TITLE}>Trang thai</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Ma phan anh:</span>
            <span>{complaint.code}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Trang thai:</span>
            <StatusBadge status={complaint.status} />
            <UrgencyBadge urgency={urgency} />
            <SlaBadge slaStatus={complaint.slaStatus} />
          </div>
          {complaint.currentDeadline && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Han xu ly: {formatDate(complaint.currentDeadline)}</span>
              </div>
              {timeRemaining && (
                <span className={`font-medium ${timeRemainingColor}`}>
                  ({timeRemaining})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className={CARD}>
        <h3 className={SECTION_TITLE}>Noi dung phan anh</h3>
        <div className="space-y-3">
          {/* Description */}
          <div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {complaint.description || 'Khong co mo ta'}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-100">
            <div><span className="text-gray-500">Loai phan anh:</span> <span className="text-gray-700 font-medium">{cat?.name || '—'}</span></div>
            <div><span className="text-gray-500">Khu pho:</span> <span className="text-gray-700 font-medium">{nb?.name || '—'}</span></div>
            {complaint.address && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Dia chi:</span> <span className="text-gray-700">{complaint.address}</span>
              </div>
            )}
          </div>

          {/* Map mock */}
          {(complaint.latitude && complaint.longitude) && (
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-500">
                <MapPin className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs font-mono">{complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}</p>
                <p className="text-xs mt-0.5">Vi tri ban do</p>
              </div>
            </div>
          )}

          {/* Images */}
          {attachments.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-2">Hinh anh dinh kem ({attachments.length})</p>
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
      </div>

      {/* ---- Processing info (public only) ---- */}
      {(dept || complaint.receivedAt || complaint.currentDeadline) && (
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Thong tin xu ly</h3>
          <div className="space-y-2 text-sm">
            {dept && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Don vi xu ly:</span>
                <span className="text-gray-700 font-medium">{dept.name}</span>
              </div>
            )}
            {complaint.receivedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Ngay tiep nhan:</span>
                <span className="text-gray-700">{formatDate(complaint.receivedAt)}</span>
              </div>
            )}
            {complaint.currentDeadline && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Du kien hoan thanh:</span>
                <span className="text-gray-700">{formatDate(complaint.currentDeadline)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Public timeline ---- */}
      {publicHistory.length > 0 && (
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Tien trinh xu ly</h3>
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200" />
            {publicHistory.map((entry, idx) => {
              const isFirst = idx === 0;
              const actor = getUserById(entry.performedBy);
              return (
                <div key={entry.id} className="relative pb-4 last:pb-0">
                  <div
                    className={`absolute left-[-17px] top-1 w-3 h-3 rounded-full border-2 ${
                      isFirst
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <div className="ml-2">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-medium text-gray-800">
                        {getActionTypeLabel(entry.actionType)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(entry.performedAt)}
                      </span>
                    </div>
                    {actor && (
                      <p className="text-xs text-gray-500">
                        {actor.fullName}
                      </p>
                    )}
                    {entry.publicNote && (
                      <p className="text-sm text-gray-700 mt-1 break-words">
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

      {/* ---- Completion result ---- */}
      {isCompleted && (
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Ket qua xu ly</h3>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Phan anh da duoc xu ly va hoan thanh
              {complaint.slaStatus === 'COMPLETED_LATE' ? ' (tre han).' : ' dung han.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ket luan SLA:</span>
            <SlaBadge slaStatus={complaint.slaStatus} />
          </div>
          {complaint.completedAt && (
            <p className="text-xs text-gray-500 mt-3">
              Hoan thanh: {formatDate(complaint.completedAt)}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
