import ContactForm from '@/components/frontend/ContactForm';
import SectionHeader from '@/components/shared/SectionHeader';

export default function ContactPage() {
  return (
    <div className=''>
      <SectionHeader title='Contact Us' />

      <div className='mt-8'>
        <ContactForm />
      </div>
    </div>
  );
}
