export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/Dashboard/dashboard.html',
      permanent: false
    }
  };
}

export default function PaidIndex() {
  return null;
}
