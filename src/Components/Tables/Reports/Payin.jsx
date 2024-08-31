import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Container, Typography, Table, TableBody, TableCell, TableContainer, Link, TableHead, TableRow, Paper, IconButton, Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSidebar } from '../../../Context/SidebarContext';

const membersData = [
  { id: 1, memberId: 'M001', txnID: 'T001', bankRRN: 'BR001', amount: '$1000', charge: '$50', credit: '$950', vpaID: 'VPA001', description: 'Payment for invoice 123', dateTime: '2024-08-20T10:00:00', status: 'Success' },
  { id: 2, memberId: 'M002', txnID: 'T002', bankRRN: 'BR002', amount: '$800', charge: '$40', credit: '$760', vpaID: 'VPA002', description: 'Refund for order 456', dateTime: '2024-08-25T14:30:00', status: 'Failed' },
  // Add more member objects as needed
];

const Payin = () => {
  const navigate = useNavigate(); 
  const { isSidebarOpen } = useSidebar(); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [pageSize, setPageSize] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(0); 
  const [previousPage, setPreviousPage] = useState(0); 
  const [dropdownValue, setDropdownValue] = useState(''); 

  useEffect(() => {
    setCurrentPage(0);
    setPreviousPage(0);
  }, [pageSize]);

  // Filter members based on search query and date range
  const filteredMembers = membersData.filter((member) => {
    const matchesName = member.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = (!startDate || new Date(member.dateTime) >= new Date(startDate)) &&
                        (!endDate || new Date(member.dateTime) <= new Date(endDate));
    return matchesName && matchesDate;
  });

  const itemsToDisplay = pageSize === 'all' ? filteredMembers.length : parseInt(pageSize, 10);
  const startIndex = currentPage * itemsToDisplay;
  const endIndex = startIndex + itemsToDisplay;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && endIndex < filteredMembers.length) {
      setPreviousPage(currentPage);
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setPreviousPage(currentPage);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1); 
  };

  return (
    <>
      <Box
        sx={{ padding: 3, marginBottom: 2, marginTop: 12 }}
        maxWidth="xl"
        style={{
          marginLeft: isSidebarOpen ? '16rem' : '10rem',
          transition: 'margin-left 0.3s ease',
          minWidth: '600px',
          maxWidth: '80%',
        }}
      >
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                boxShadow: '5px 0 10px -3px rgba(0, 128, 128, 0.6)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'blue' }}>
              Total Success
              </Typography>
              <Typography>₹ 0.00/0</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                boxShadow: '5px 0 10px -3px rgba(0, 128, 128, 0.6)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'blue' }}>
              Total Success Charge
              </Typography>
              <Typography>₹ 0.00/0</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                boxShadow: '5px 0 10px -3px rgba(0, 128, 128, 0.6)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'blue' }}>
              Total Failed
              </Typography>
              <Typography>₹ 0.00/0</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Container
        maxWidth="xl"
        style={{
          marginLeft: isSidebarOpen ? '16rem' : '10rem',
          transition: 'margin-left 0.3s ease',
          minWidth: '600px',
          maxWidth: '80%',
        }}
      >
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Grid container alignItems="center" spacing={1} mb={2}>
            <Grid item xs={12} md={3}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <IconButton color="primary" onClick={handleBackButtonClick}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="h1" gutterBottom>
                  UPI Collection
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="dropdown-label">All Users</InputLabel>
                <Select
                  labelId="dropdown-label"
                  value={dropdownValue}
                  onChange={(e) => setDropdownValue(e.target.value)}
                  label="Dropdown Label"
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="page-size-label">Items Per Page</InputLabel>
                <Select
                  labelId="page-size-label"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Items Per Page"
                >
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value="all">View All</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Link href="/report/Qr">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '40px' }}
                >
                  Old UPI Collection
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={2}>
              <Link href="">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ height: '40px', background :'green' }}
                >
                  Export
                </Button>
              </Link>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>MemberID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>TxnID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Bank RRN</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Charge</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Credit</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>VPAID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Date Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', border: '1px solid rgba(224, 224, 224, 1)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center">No records found.</TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.id}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.memberId}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.txnID}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.bankRRN}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.amount}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.charge}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.credit}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.vpaID}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.description}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.dateTime}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{member.status}</TableCell>
                      <TableCell sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <IconButton color="primary" size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" marginTop={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handlePageChange('prev')}
              disabled={previousPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handlePageChange('next')}
              disabled={endIndex >= filteredMembers.length}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Payin;
