const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t'>
      <div className='p-5 flex-center'>{`© ${currentYear} Sparkle Cart. All Rights Reserved.`}</div>
    </footer>
  );
};

export default Footer;
