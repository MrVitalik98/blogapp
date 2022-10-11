const getIPAddress = async () => {
  try {
    const response = await fetch(
      `https://geolocation-db.com/json/${process.env.REACT_APP_API_KEY}`
    );
    const data = await response.json();

    return { IPv4: data?.IPv4 };
  } catch (e) {
    return { IPv4: " " };
  }
};

export default getIPAddress;
