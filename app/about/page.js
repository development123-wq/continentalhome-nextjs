import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import Content from './Content/Content';

export const metadata = {
  title: "About Uss - Continental Home",
  description: "Learn more about Continental Home, our mission, vision, and the premium home solutions we provide.",
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