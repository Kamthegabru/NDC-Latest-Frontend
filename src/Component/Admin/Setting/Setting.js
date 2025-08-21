import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Modal,
  Button,
  Divider
} from "@mui/material";
import SettingContext from "../../../Context/Admin/Setting/SettingContext";

function Setting() {
  const { settings, fetchSettings, updateSetting } = useContext(SettingContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingSetting, setPendingSetting] = useState(null);
  const [pendingValue, setPendingValue] = useState(false);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleToggle = (key, value) => {
    setPendingSetting(key);
    setPendingValue(value);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    updateSetting(pendingSetting, pendingValue);
    setModalOpen(false);
    setPendingSetting(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setPendingSetting(null);
  };

  // Settings display config
  const settingsList = [
    {
      key: "sendWelcomeEmail",
      label: "Send Welcome Email",
      desc: "Automatically send a welcome email to new users."
    },
    {
      key: "sendCustomerPDF",
      label: "Send Customer PDF",
      desc: "Send customer PDF after registration."
    },
    {
      key: "sendAgreementPDF",
      label: "Send Agreement PDF",
      desc: "Send agreement PDF after registration."
    },
    {
      key: "sendCertificatePDF",
      label: "Send Certificate PDF",
      desc: "Send certificate PDF after registration."
    },
    {
      key: "orgIdAndLocationCode",
      label: "Org ID & Location Code",
      desc: "Enable Org ID and Location Code assignment."
    }
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#003366" }}>
        Website Settings
      </Typography>
      {settingsList.map((setting, idx) => (
        <Card
          key={setting.key}
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f5f5f5",
            p: 0
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              p: 2
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#003366" }}
              >
                {setting.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontSize: 14 }}
              >
                {setting.desc}
              </Typography>
            </Box>
            <Switch
              checked={!!settings[setting.key]}
              onChange={(_, checked) => handleToggle(setting.key, checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#003366"
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#003366"
                }
              }}
            />
          </CardContent>
          {idx !== settingsList.length - 1 && <Divider />}
        </Card>
      ))}

      <Modal open={modalOpen} onClose={handleCancel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 320,
            textAlign: "center"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#003366", fontWeight: "bold" }}>
            Confirm Change
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to {pendingValue ? "enable" : "disable"} <b>{settingsList.find(s => s.key === pendingSetting)?.label}</b>?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#003366", color: "#fff" }}
              onClick={handleConfirm}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "#003366", borderColor: "#003366" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Setting