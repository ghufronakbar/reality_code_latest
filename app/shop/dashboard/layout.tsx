interface Props {
  children: React.ReactNode;
}

const SellerDashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <h1>Seller Dashboard</h1>
      {children}
    </div>
  );
};

export default SellerDashboardLayout;
