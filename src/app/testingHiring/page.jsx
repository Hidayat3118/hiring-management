

const Testing = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("internation delay");
    }, 2000);
  });

  return <div>Testing halaman</div>;
};

export default Testing;
