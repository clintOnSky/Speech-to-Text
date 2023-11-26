import { Redirect } from "expo-router";
const RootPage = () => {
  // The index page is always opened first before the page passed in the initialRouteName prop in the layout
  // So the index page must not be deleted
  return <Redirect href={"/signin"} />;
};

export default RootPage;
