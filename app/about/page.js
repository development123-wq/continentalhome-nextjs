import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import '@/app/globals.css';
import Content from './Content/Content';

export const metadata = {
  title: "About Us - Continental Home",
  description: "",
  keywords:'Rope lamps, Teak Lamps, Ceramic Sealife Lamps, Ceramic Sealife Vases',
};

const About = () => {
  return (
    <div className="main-aboutpage">
      <Navbar />
      <InnerBanner />
      <Content />
      <Footer />
    </div>
  );
};

export default About;