const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t'>
      <div className='p-5 flex-center'>{`© ${currentYear} Dapper Fit. All Rights Reserved.`}</div>
    </footer>
  );
};

export default Footer;
