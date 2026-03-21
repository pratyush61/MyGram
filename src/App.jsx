import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "./socket";

import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import EmailVerification from "./pages/EmailVerification";
import EnterResetOtp from "./pages/EnterResetOtp";
import Edit from "./pages/Edit";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import ChatBoxMobile from "./components/ChatboxMobile";
import ResetPassword from "./pages/ResetPassword";

import { fetchNotifications } from "./redux/notificationSlice";

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      socket.auth = { userId: user._id };
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("frontend socket connected:", socket.id);

      if (user?._id) {
        socket.emit("join", user._id);
        console.log("user joined socket:", user._id);
      }
    });

    return () => {
      socket.off("connect");
    };
  }, [user?._id]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, user?._id, dispatch]);

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-otp" element={<EnterResetOtp />} />
      <Route path="/enter-reset-otp" element={<EnterResetOtp />} />
      <Route path="/email-verification" element={<EmailVerification />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/post/:postId" element={<Profile />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:chatId" element={<ChatBoxMobile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/edit-profile" element={<Edit />} />
        <Route path="/user/:username" element={<UserProfile />} />
      </Route>
    </Routes>
  );
};

export default App;