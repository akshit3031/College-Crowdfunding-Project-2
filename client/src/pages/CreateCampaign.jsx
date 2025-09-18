import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();

  const [form, setForm] = useState({
  student: "",
  studentRoll: "",
  title: "",
  description: "",
  minimumContribution: "", // <-- added
  targetAmount: "",
  image: "",
});


  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const { student, studentRoll, title, description, targetAmount, image } = form;
    if (!student || !studentRoll || !title || !description || !targetAmount || !image) {
      alert("Please fill all required fields");
      return;
    }

    // Validate image URL
    checkIfImage(image, async (exists) => {
      if (!exists) {
        alert("Provide a valid image URL");
        setForm({ ...form, image: "" });
        return;
      }

      setIsLoading(true);
      try {
        await createCampaign({
          student,
          studentRoll,
          title,
          description,
          image,
          targetAmount: targetAmount.toString(), // ensure string for parseEther
           minimumContribution: form.minimumContribution.toString(), // <-- added
        });
        navigate("/");
      } catch (err) {
        console.error("Campaign creation failed:", err);
        alert("Failed to create campaign. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto lg:max-w-3xl xl:max-w-4xl">
      <div className="bg-white flex justify-center items-start flex-col rounded-[10px] p-4 sm:p-6 lg:p-8 w-full min-h-[calc(100vh-120px)] overflow-y-auto border-2 border-[#DCDCDC]">
        {isLoading && <Loader />}
        <div className="flex justify-center items-center p-[16px] w-full bg-[#E62727] rounded-[10px]">
          <h1 className="font-epilogue font-bold text-[18px] sm:text-[25px] text-white text-center">
            Start a College Campaign
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-[30px] flex flex-col gap-[25px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <FormField
              labelName="Student Name *"
              placeholder="John Doe"
              inputType="text"
              value={form.student}
              handleChange={(e) => handleFormFieldChange("student", e)}
            />
            <FormField
              labelName="Roll Number *"
              placeholder="123456"
              inputType="text"
              value={form.studentRoll}
              handleChange={(e) => handleFormFieldChange("studentRoll", e)}
            />
          </div>
          
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />

          <FormField
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange("description", e)}
          />

          <div className="w-full flex flex-col sm:flex-row justify-start items-center p-3 sm:p-4 bg-[#1E93AB] rounded-[10px] gap-3">
            <img src={money} alt="money" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] object-contain flex-shrink-0" />
            <h4 className="font-epilogue font-bold text-[16px] sm:text-[20px] text-white text-center sm:text-left">
              You will get 100% of the raised amount
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <FormField
              labelName="Minimum Contribution (ETH) *"
              placeholder="0.01"
              inputType="text"
              value={form.minimumContribution}
              handleChange={(e) => handleFormFieldChange("minimumContribution", e)}
            />
            
            <FormField
              labelName="Goal (ETH) *"
              placeholder="0.5"
              inputType="text"
              value={form.targetAmount}
              handleChange={(e) => handleFormFieldChange("targetAmount", e)}
            />
          </div>

          <FormField
            labelName="Campaign Image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange("image", e)}
          />

          <div className="flex justify-center items-center mt-[30px] w-full">
            <CustomButton btnType="submit" title="Submit new campaign" styles="bg-[#E62727] hover:bg-[#c91f1f] w-full sm:w-auto" />
          </div>
      </form>
    </div>
    </div>
  );
};

export default CreateCampaign;
