import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  Box,
  InputLabel,
  FormControl,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSidebar } from "../../../Context/SidebarContext";
import { domainBase } from "../../../helpingFile";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { apiGet } from "../../../utils/http";



const API_ENDPOINT = `${domainBase}apiAdmin/v1/payout/allPayOutPayment`;

const PayoutGenerate = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState({
    page: 1,
    limit: 25,
    keyword: "",
    startDate: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [totalCount, setTotalCount] = useState(0); // Total records count

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response =  await apiGet(API_ENDPOINT, { ...filterData })
        setData(
          response.data.data.map((item, index) => ({
            id: index + 1,
            memberId: item.userInfo.memberId,
            name: item.userInfo.fullName,
            accountNumber: item.accountNumber,
            ifsc: item.ifscCode,
            amount: `${item.amount}`,
            txnId: item.trxId,
            status: item.isSuccess,
            dateTime: formatDateTime(item.createdAt),
          }))
        );
        setTotalCount(response.data.totalCount);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setFilterData({
        ...filterData,
        keyword: searchQuery,
      });
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilterData((prev) => ({ ...prev, [key]: value }));
  };

  // console.log(filterData)
  const handlePageChange = (event, value) => {
    handleFilterChange("page", value);
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleExport = () => {
    const csvData = data.map((item) => ({
      ID: item.id,
      MemberID: item.memberId,
      Name: item.name,
      AccountNumber: item.accountNumber,
      IFSC: item.ifsc,
      Amount: item.amount,
      ChargeAmount: item.chargeAmount,
      FinalAmount: item.finalAmount,
      TxnID: item.txnId,
      RRN: item.rrn,
      Status: item.status,
      DateTime: item.dateTime,
    }));

    const csv = Papa.unparse(csvData); // Convert to CSV format
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // Create Blob
    saveAs(
      blob,
      `Payout_History_${new Date().toISOString().split("T")[0]}.csv`
    ); // Save file
  };

  return (
    <>
      <Box
        sx={{ padding: 3, marginBottom: 2, marginTop: 12 }}
        maxWidth="xl"
        style={{
          marginLeft: isSidebarOpen ? "16rem" : "10rem",
          transition: "margin-left 0.3s ease",
          minWidth: "600px",
          maxWidth: "80%",
        }}
      >
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: "5px 0 10px -3px rgba(0, 128, 128, 0.6)",
              }}
            >
              <Typography variant="h6" sx={{ color: "teal" }}>
                Total balance
              </Typography>
              <Typography>
                ₹{" "}
                {data.length > 0
                  ? data
                      .reduce(
                        (total, user) => total + parseFloat(user.amount || 0),
                        0
                      )
                      .toLocaleString("en-IN", { minimumFractionDigits: 2 })
                  : "0.00"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: "5px 0 10px -3px rgba(0, 128, 128, 0.6)",
              }}
            >
              <Typography variant="h6" sx={{ color: "teal" }}>
                Total Transaction Generate
              </Typography>
              <Typography>{data.length}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Container
        maxWidth="xl"
        style={{
          marginLeft: isSidebarOpen ? "16rem" : "10rem",
          transition: "margin-left 0.3s ease",
          minWidth: "600px",
          maxWidth: "80%",
          // marginTop: "8%",
        }}
      >
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          {/* Header Section */}
          <Grid container alignItems="center" spacing={1} mb={2}>
            <Grid item xs={12} md={5}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <IconButton color="primary" onClick={handleBackButtonClick}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ color: "teal" }}
                  >
                    Payout Genarate
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Search by Member ID or txnID"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                value={filterData?.startDate}
                onChange={(e) =>
                  setFilterData({
                    ...filterData,
                    startDate: e.target.value,
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2} align="right" marginBottom={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExport}
              >
                Export
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Items per Page</InputLabel>
            <Select
              value={filterData.limit}
              onChange={(e) => handleFilterChange("limit", e.target.value)}
              label="Items per Page"
            >
              {[25, 50, 100, 500].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
            <Grid item xs={12} md={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="Success">Success</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
          </Grid>

          {/* Table Section */}
          <TableContainer component={Paper}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    MemberID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    Account No.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    IFSC
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    Txn ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      border: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    Date Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data available.
                    </TableCell>
                  </TableRow>
               ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.memberId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.accountNumber}</TableCell>
                    <TableCell>{item.ifsc}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.txnId}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.dateTime}</TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
          </TableContainer>
          
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                  <Pagination
                    count={Math.ceil(totalCount / filterData.limit)}
                    page={filterData.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
        </Paper>
      </Container>
    </>
  );
};

export default PayoutGenerate;
