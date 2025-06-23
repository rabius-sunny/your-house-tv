import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/nav-bar';

type TProps = {
  children: React.ReactNode;
};

export default function FrontendLayout({ children }: TProps) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
