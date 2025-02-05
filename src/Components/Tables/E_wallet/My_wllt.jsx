import { useState, useEffect } from "react";
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
  InputLabel,
  FormControl,
  Box,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSidebar } from "../../../Context/SidebarContext";
import { apiGet } from "../../../utils/http";

const API_ENDPOINT = `apiAdmin/v1/wallet/getAllTransactionEwallet`;

const My_Wllt = () => {
  const { isSidebarOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState({
    page: 1,
    limit: 25,
    keyword: "",
    startDate: "",
    endDate: "",
    memberId: "",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [reloadStrict, setreloadStrict] = useState(0);


  const fetchData = async (exportCSV = false) => {
    try {
      const response = await apiGet(API_ENDPOINT, { ...filterData , export: exportCSV});
      if (exportCSV == "true") {
        const blob = new Blob([response.data], { type: 'text/csv' }); 
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `Transations${filterData.startDate}-${filterData.endDate}.csv`;  

          link.click();
          link.remove();
      } else{
        setTransactions(response.data.data);
        setTotalCount(response.data.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterData]);

  const handleFilterChange = (key, value) => {
    setFilterData((prev) => ({ ...prev, [key]: value }));
  };

  const handlesearchtxn = (e) => {
    setSearchQuery(e.target.value)
    setreloadStrict(1)
  }


  const handlePageChange = (event, value) => {
    setFilterData((prev) => ({
      ...prev,
      page: value,
    }));
  };

  useEffect(() => {
    if (reloadStrict !== 0) {
    const timeOutId = setTimeout(() => {
      setFilterData({
        ...filterData,
        memberId: searchQuery,
      });
    }, 500);
    return () => clearTimeout(timeOutId);
  }
  }, [searchQuery]);


  return (
    <Container
      maxWidth="xl"
      style={{
        marginLeft: isSidebarOpen ? "16rem" : "10rem",
        transition: "margin-left 0.3s ease",
        minWidth: "600px",
        maxWidth: "80%",
        marginTop: "8%",
      }}
    >
      <Paper sx={{ p: 2, boxShadow: 3 }}>
        <Grid container alignItems="center" spacing={1} mb={2}>
          <Grid item xs={12} md={4}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <IconButton color="primary">
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
                  My E-Wallet
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container alignItems="center" spacing={1} mb={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Search by Member ID"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handlesearchtxn}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Select Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={filterData?.startDate}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  startDate: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="End Date & Time"
              type="date"
              value={filterData?.endDate}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  endDate: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Items per Page</InputLabel>
              <Select
                value={filterData?.limit}
                onChange={(e) => handleFilterChange("limit", e.target.value)}
                label="Items per Page"
              >
                {[25, 50, 100, 500]?.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" color="primary" onClick={() => fetchData("true")}>
              Export
            </Button>
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
                  #
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
                  Before Amount
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  Cr/Dr Amount
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  After Amount
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
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  Description
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
              </TableRow>
            </TableHead>
            <TableBody>
              
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <TableRow key={transaction._id}>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {(filterData.limit*(filterData.page-1) + index+1)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {transaction.userInfo?.memberId || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {transaction.beforeAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {(transaction.transactionAmount ?? 0) +
                        (transaction.chargeAmount ?? 0)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {transaction.afterAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {new Date(transaction.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {transaction.transactionType === "Cr." ? (
                        <Button sx={{ color: "green", fontWeight: "bold" }}>
                          Cr.
                        </Button>
                      ) : (
                        <Button sx={{ color: "red", fontWeight: "bold" }}>
                          Dr.
                        </Button>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {transaction.description}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {transaction.transactionStatus ? (
                        <Button
                          sx={{
                            color: "green",
                            textTransform: "lowercase",
                            backgroundColor: "rgba(0, 128, 0, 0.1)",
                            borderRadius: 2,
                            padding: "2px 10px",
                          }}
                        >
                          Success
                        </Button>
                      ) : (
                        <Button
                          sx={{
                            color: "red",
                            textTransform: "lowercase",
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            borderRadius: 2,
                            padding: "2px 10px",
                          }}
                        >
                          Failed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    sx={{ textAlign: "center", padding: "16px" }}
                  >
                    Data Not Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Pagination
            count={parseInt(totalCount/filterData.limit)==0?parseInt(totalCount/filterData.limit):parseInt(totalCount/filterData.limit)+1}
            page={filterData?.page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default My_Wllt;
