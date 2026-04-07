const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

function serializePayload(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function getAuthHeaders(formData) {
  return {
    ...formData.getHeaders(),
    "x-secret-key": process.env.X_SECRET_KEY,
  };
}

exports.ingestPdfForSubSection = async ({ course, subSection, notesPdf }) => {
  const formData = new FormData();

  formData.append("course", serializePayload(course));
  formData.append("subSection", serializePayload(subSection));
  formData.append("notesPdf", fs.createReadStream(notesPdf.tempFilePath), {
    filename: notesPdf.name,
    contentType: notesPdf.mimetype,
  });

  return axios.post(process.env.FAST_API_URL + "/ingestPdf", formData, {
    headers: getAuthHeaders(formData),
  });
};

exports.deletePdfIngestionForSubSection = async ({ course, subSection }) => {
  const formData = new FormData();

  formData.append("course", serializePayload(course));
  formData.append("subSection", serializePayload(subSection));

  return axios.post(process.env.FAST_API_URL + "/deletePdfIngestion", formData, {
    headers: getAuthHeaders(formData),
  });
};
