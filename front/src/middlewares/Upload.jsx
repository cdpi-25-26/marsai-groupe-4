export function UploadRoleGuard ({ children }) {
  const userRole = localStorage.getItem("role");
  if (userRole === "PRODUCER") {
    return children;
  } else {
    return <div>Access Denied</div>;
  }
}