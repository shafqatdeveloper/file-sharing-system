import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../../Components/Loaders/Loader";

const MyAccount = () => {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    username: "",
    phoneNumber: "",
    companyName: "",
    address: "",
    country: "",
    timezone: "",
    city: "",
    stateProvince: "",
    zipPostalCode: "",
    photo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLoggedInUser = () => {
    fetch("/api/user/me")
      .then((response) => response.json())
      .then((data) => {
        setFormData(data.loggedInUser);
        if (data.loggedInUser.photo) {
          setImagePreview(data.loggedInUser.photo);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };
  useEffect(() => {
    // Fetch data from backend API
    fetchLoggedInUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fName = formData.fName;
    const lName = formData.lName;
    const username = formData.username;
    const phoneNumber = formData.phoneNumber;
    const companyName = formData.companyName;
    const address = formData.address;
    const country = formData.country;
    const timezone = formData.timezone;
    const city = formData.city;
    const stateProvince = formData.stateProvince;
    const zipPostalCode = formData.zipPostalCode;
    try {
      const response = await axios.put("/api/user/update", {
        fName,
        lName,
        username,
        phoneNumber,
        companyName,
        address,
        country,
        timezone,
        city,
        stateProvince,
        zipPostalCode,
      });
      if (response.data.success) {
        toast(response.data.message);
        setFormData({
          fName: "",
          lName: "",
          username: "",
          phoneNumber: "",
          companyName: "",
          address: "",
          country: "",
          timezone: "",
          city: "",
          stateProvince: "",
          zipPostalCode: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      fetchLoggedInUser();
    }
  };

  return (
    <div className="h-full py-5 bg-gray-100 flex justify-center items-center">
      <form
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full"
        onSubmit={handleSubmit}
      >
        <div className="bg-red-600 text-white text-lg rounded-t-lg w-full text-center py-3">
          <p>This Page is Still Under Development</p>
        </div>
        <h1 className="text-center my-8 pb-2 border-b-[1.5px] border-b-primaryDark border-dashed text-2xl text-primaryDark font-bold tracking-wide font-sans">
          MY ACCOUNT
        </h1>
        <section className="mb-8 w-full border-b-[1px] border-b-primaryDark border-dashed pb-5">
          <h2 className="text-xl pl-5 uppercase font-semibold mb-6 w-max text-gray-600">
            Personal Information
          </h2>
          <div className="flex w-full p-2 items-start flex-col md:flex-row gap-3">
            <div className="flex items-center md:w-2/6 w-full flex-col gap-5 mb-4">
              <div className="flex flex-col items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-full w-32 h-32 border-[1.5px] border-primaryDark object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400" size={70} />
                )}
                <label className="px-6 py-2 bg-primaryDark text-white rounded-full cursor-pointer">
                  {imagePreview ? "Change Photo" : "Add Photo"}
                  <input
                    type="file"
                    name="photo"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <button className="pt-5 text-primaryDark">Change Password</button>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-5 md:px-0">
              <InputField
                label="First Name"
                name="fName"
                placeholder="Enter your first name"
                value={formData.fName}
                onChange={handleInputChange}
              />
              <InputField
                label="Last Name"
                name="lName"
                placeholder="Enter your last name"
                value={formData.lName}
                onChange={handleInputChange}
              />
              <InputField
                label="Username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <InputField
                label="Company Name"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
              <InputField
                label="Address"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Address Section */}

        <section>
          <h2 className="text-xl pl-10 uppercase font-semibold mb-4 w-max text-gray-600">
            Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 sm:p-10">
            <InputField
              label="Country"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleInputChange}
            />
            <InputField
              label="Timezone"
              name="timezone"
              placeholder="Enter timezone"
              value={formData.timezone}
              onChange={handleInputChange}
            />
            <InputField
              label="Address"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <InputField
              label="City"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <InputField
              label="State/Province"
              name="stateProvince"
              placeholder="Enter state/province"
              value={formData.stateProvince}
              onChange={handleInputChange}
            />
            <InputField
              label="Zip/Postal Code"
              name="zipPostalCode"
              placeholder="Enter zip/postal code"
              value={formData.zipPostalCode}
              onChange={handleInputChange}
            />
          </div>
        </section>

        <div className="w-full flex items-center justify-center mb-10">
          <button
            type="submit"
            className="mt-8 h-10 w-24 bg-primaryDark text-white rounded"
          >
            {loading ? <Loader /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, name, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-green-300"
    />
  </div>
);

export default MyAccount;
