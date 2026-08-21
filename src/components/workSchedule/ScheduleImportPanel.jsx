import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { validateFileImport } from "../../validator/fileValidator";

const MAX_FILE_SIZE_LABEL = "10 MB";
const IMPORT_RESULT_PAGE_SIZE = 15;

const IMPORT_COLUMNS = [
  "Ngày tiếp dân",
  "Từ",
  "Đến",
  "Mã quầy",
  "Tài khoản cán bộ",
  "Họ tên cán bộ",
  "Sức chứa / ca",
  "Địa điểm",
  "Ghi chú",
];

const Step = ({ number, title, description, icon: Icon, active }) => (
  <div className="flex min-w-0 flex-1 items-start gap-3">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
        active
          ? "border-blue-200 bg-blue-600 text-white shadow-sm shadow-blue-100"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        Bước {number}
      </div>
      <div className="mt-0.5 text-sm font-bold text-slate-900">{title}</div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  </div>
);

export default function ScheduleImportPanel({
  onClose,
  onDownloadTemplate,
  onImport,
  isDownloading,
  isImporting,
  result,
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [resultPage, setResultPage] = useState(1);
  const [resultDateFilter, setResultDateFilter] = useState("");

  const importedRows = result?.stats?.importedRows || [];
  const importedDates = result?.stats?.importedDates || [];
  const filteredImportedRows = useMemo(
    () =>
      resultDateFilter
        ? importedRows.filter((row) => row.receptionDate === resultDateFilter)
        : importedRows,
    [importedRows, resultDateFilter]
  );
  const resultTotalPages = Math.max(
    1,
    Math.ceil(filteredImportedRows.length / IMPORT_RESULT_PAGE_SIZE)
  );
  const displayedImportedRows = filteredImportedRows.slice(
    (resultPage - 1) * IMPORT_RESULT_PAGE_SIZE,
    resultPage * IMPORT_RESULT_PAGE_SIZE
  );

  useEffect(() => {
    setResultPage(1);
    setResultDateFilter("");
  }, [result]);

  useEffect(() => {
    setResultPage(1);
  }, [resultDateFilter]);

  const formatDisplayDate = (value) => {
    const [year, month, day] = String(value || "").split("-");
    return year && month && day ? `${day}/${month}/${year}` : value;
  };

  const selectFile = async (nextFile) => {
    setFileError("");
    if (!nextFile) return;

    const validation = await validateFileImport({ file: nextFile });
    if (!validation.valid) {
      setFile(null);
      setFileError(validation.errors.file);
      return;
    }

    setFile(nextFile);
  };

  const resetFile = () => {
    setFile(null);
    setFileError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const submitImport = async () => {
    if (!file || isImporting) return;
    const succeeded = await onImport(file);
    if (succeeded) resetFile();
  };

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/70 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-950 md:text-lg">
                  Import lịch tiếp dân và phân công quầy
                </h2>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  8 quầy
                </span>
              </div>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                Một dòng Excel tương ứng một cán bộ trực một quầy trong khoảng giờ đã khai báo.
                Backend tự tách thành các ca một giờ và chỉ mở những quầy có dữ liệu hợp lệ.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Đóng khu vực import"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-start">
          <Step
            number="1"
            title="Tải file mẫu"
            description="Dùng đúng mẫu 9 cột do hệ thống cung cấp."
            icon={Download}
            active
          />
          <ChevronRight className="mt-3 hidden h-5 w-5 text-slate-300 lg:block" />
          <Step
            number="2"
            title="Điền lịch và phân công"
            description="Nhập mã quầy, tài khoản cán bộ, giờ trực và sức chứa."
            icon={Building2}
            active
          />
          <ChevronRight className="mt-3 hidden h-5 w-5 text-slate-300 lg:block" />
          <Step
            number="3"
            title="Kiểm tra và import"
            description="File sai bất kỳ dòng nào sẽ không ghi dữ liệu vào hệ thống."
            icon={ShieldCheck}
            active={Boolean(file)}
          />
        </div>
      </div>

      <div className="grid gap-5 p-4 md:p-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div>
          <div
            className={`relative flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : fileError
                ? "border-red-300 bg-red-50/60"
                : file
                ? "border-emerald-300 bg-emerald-50/50"
                : "border-slate-300 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/40"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              selectFile(event.dataTransfer.files?.[0]);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              data-testid="schedule-import-file"
              className="hidden"
              onChange={(event) => selectFile(event.target.files?.[0])}
            />

            {file ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <FileCheck2 className="h-7 w-7" />
                </div>
                <p className="mt-4 max-w-full truncate text-sm font-bold text-slate-900">{file.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Sẵn sàng kiểm tra
                </p>
                <button
                  type="button"
                  onClick={resetFile}
                  disabled={isImporting}
                  className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Chọn file khác
                </button>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-900">
                  Kéo thả file Excel vào đây
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Hỗ trợ .xlsx, .xls · Dung lượng tối đa {MAX_FILE_SIZE_LABEL}
                </p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Chọn file từ máy
                </button>
              </>
            )}
          </div>

          {fileError && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {result && (
            <div
              className={`mt-3 rounded-xl border px-4 py-3 ${
                result.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold">{result.message}</p>
                  {result.success && result.stats && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-lg bg-white/80 px-2.5 py-1.5">
                        {result.stats.importedRowCount || 0} dòng
                      </span>
                      <span className="rounded-lg bg-white/80 px-2.5 py-1.5">
                        {result.stats.totalCounterSlots || 0} cấu hình quầy/ca
                      </span>
                      <span className="rounded-lg bg-white/80 px-2.5 py-1.5">
                        {result.stats.totalAssignments || 0} phân công
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onDownloadTemplate}
              disabled={isDownloading || isImporting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Tải file Excel mẫu
            </button>
            <button
              type="button"
              onClick={submitImport}
              disabled={!file || isImporting || isDownloading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {isImporting ? "Đang kiểm tra và import..." : "Kiểm tra và import lịch"}
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Quy tắc dữ liệu</h3>
          </div>
          <ul className="mt-3 space-y-3 text-xs leading-5 text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              Cán bộ phải đang hoạt động và có quyền <strong className="text-slate-800">RR_APPROVE</strong>.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              Mã quầy dùng từ <strong className="text-slate-800">QUAY_1</strong> đến <strong className="text-slate-800">QUAY_8</strong> và phải tồn tại trong hệ thống.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              Một cán bộ không được trực nhiều quầy trong cùng một ca; một quầy/ca chỉ có một cán bộ.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              Sức chứa để trống sẽ lấy mặc định của quầy; nếu nhập phải là số nguyên từ 1 trở lên.
            </li>
          </ul>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
              9 cột trong file mẫu
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {IMPORT_COLUMNS.map((column) => (
                <span
                  key={column}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600"
                >
                  {column}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {result?.success && importedRows.length > 0 && (
        <div className="border-t border-slate-200 px-4 pb-5 pt-5 md:px-6 md:pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-950">
                  Chi tiết dữ liệu đã import
                </h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {importedRows.length} dòng
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Dữ liệu đã được backend kiểm tra và lưu thành công từ ngày {formatDisplayDate(result.stats.dateFrom)} đến {formatDisplayDate(result.stats.dateTo)}.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
              Ngày tiếp dân
              <select
                value={resultDateFilter}
                onChange={(event) => setResultDateFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Tất cả ngày</option>
                {importedDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDisplayDate(date)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[1120px] w-full text-left text-xs">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-3 py-3 font-bold">Dòng</th>
                    <th className="px-3 py-3 font-bold">Ngày tiếp dân</th>
                    <th className="px-3 py-3 font-bold">Thời gian</th>
                    <th className="px-3 py-3 font-bold">Quầy</th>
                    <th className="px-3 py-3 font-bold">Cán bộ phụ trách</th>
                    <th className="px-3 py-3 text-center font-bold">Sức chứa/ca</th>
                    <th className="px-3 py-3 font-bold">Địa điểm</th>
                    <th className="px-3 py-3 font-bold">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayedImportedRows.map((row) => (
                    <tr key={`${row.rowNumber ?? "auto"}-${row.receptionDate}-${row.startTime}-${row.counterCode}`} className="hover:bg-blue-50/40">
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-500">
                        {row.rowNumber ? `#${row.rowNumber}` : "Tự xếp"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-bold text-slate-800">
                        {formatDisplayDate(row.receptionDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                        {row.startTime} - {row.endTime}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-md bg-blue-50 px-2 py-1 font-bold text-blue-700">
                          {row.counterCode}
                        </span>
                        <div className="mt-1 text-[11px] text-slate-500">{row.counterName}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-slate-800">{row.officerFullName}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">{row.officerUsername}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-800">
                        {row.capacity}
                      </td>
                      <td className="px-3 py-3 text-slate-700">{row.location}</td>
                      <td className="max-w-[260px] px-3 py-3 text-slate-600">
                        {row.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">
                Hiển thị {filteredImportedRows.length === 0 ? 0 : (resultPage - 1) * IMPORT_RESULT_PAGE_SIZE + 1}–{Math.min(resultPage * IMPORT_RESULT_PAGE_SIZE, filteredImportedRows.length)} trên {filteredImportedRows.length} dòng
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResultPage((page) => Math.max(1, page - 1))}
                  disabled={resultPage === 1}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang trước
                </button>
                <span className="min-w-[72px] text-center text-xs font-bold text-slate-700">
                  {resultPage}/{resultTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setResultPage((page) => Math.min(resultTotalPages, page + 1))}
                  disabled={resultPage === resultTotalPages}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
