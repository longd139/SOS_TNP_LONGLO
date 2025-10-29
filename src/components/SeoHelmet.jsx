
import { Helmet } from "react-helmet-async";

export default function SeoHelmet({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title ? `${title} – UBND Tăng Nhơn Phú` : "UBND Tăng Nhơn Phú"}</title>
      <meta name="description" content={description || "Cổng quản trị UBND Phường Tăng Nhơn Phú"} />
      <meta name="keywords" content={keywords || "UBND, Tăng Nhơn Phú, quản lý hành chính, báo cáo, tin tức"} />
      <meta name="author" content="UBND Phường Tăng Nhơn Phú" />
      <meta property="og:title" content={title || "UBND Tăng Nhơn Phú"} />
      <meta property="og:description" content={description || "Cổng quản trị UBND Phường Tăng Nhơn Phú"} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/logo512.png" />
    </Helmet>
  );
}
