import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ScheduleImportPanel from "./ScheduleImportPanel";

const defaultProps = {
  onClose: jest.fn(),
  onDownloadTemplate: jest.fn(),
  onImport: jest.fn().mockResolvedValue(true),
  isDownloading: false,
  isImporting: false,
  result: null,
};

describe("ScheduleImportPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chỉ cho import sau khi chọn file Excel hợp lệ", async () => {
    render(<ScheduleImportPanel {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: "Kiểm tra và import lịch" });
    expect(submitButton).toBeDisabled();

    const file = new File(["excel-content"], "lich-tiep-dan.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fireEvent.change(screen.getByTestId("schedule-import-file"), {
      target: { files: [file] },
    });

    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => expect(defaultProps.onImport).toHaveBeenCalledWith(file));
  });

  it("từ chối file CSV vì backend chỉ nhận Excel", async () => {
    render(<ScheduleImportPanel {...defaultProps} />);

    const file = new File(["date,counter"], "lich-tiep-dan.csv", {
      type: "text/csv",
    });
    fireEvent.change(screen.getByTestId("schedule-import-file"), {
      target: { files: [file] },
    });

    expect(
      await screen.findByText("Định dạng file không hỗ trợ. Vui lòng chọn file .xlsx hoặc .xls")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kiểm tra và import lịch" })).toBeDisabled();
  });

  it("hiển thị thống kê backend trả về sau import", () => {
    render(
      <ScheduleImportPanel
        {...defaultProps}
        result={{
          success: true,
          message: "Import lịch tiếp dân thành công",
          stats: {
            importedRowCount: 8,
            totalCounterSlots: 32,
            totalAssignments: 32,
            dateFrom: "2026-09-09",
            dateTo: "2026-09-30",
            importedDates: ["2026-09-09", "2026-09-30"],
            importedRows: [{
              rowNumber: 2,
              receptionDate: "2026-09-09",
              startTime: "07:30",
              endTime: "11:30",
              counterCode: "QUAY_1",
              counterName: "Quầy số 1",
              officerUsername: "canbo1",
              officerFullName: "Nguyễn Văn An",
              capacity: 2,
              location: "Bộ phận tiếp công dân",
              note: "Ca sáng - phân công luân phiên",
            }],
          },
        }}
      />
    );

    expect(screen.getByText("8 dòng")).toBeInTheDocument();
    expect(screen.getByText("32 cấu hình quầy/ca")).toBeInTheDocument();
    expect(screen.getByText("32 phân công")).toBeInTheDocument();
    expect(screen.getByText("Chi tiết dữ liệu đã import")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn An")).toBeInTheDocument();
    expect(screen.getByText("canbo1")).toBeInTheDocument();
    expect(screen.getByText("Ca sáng - phân công luân phiên")).toBeInTheDocument();
  });
});
