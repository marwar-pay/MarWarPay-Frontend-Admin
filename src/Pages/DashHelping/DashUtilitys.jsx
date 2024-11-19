import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { Box } from '@mui/material';
import axios from 'axios';
import { domainBase, accessToken } from '../../helpingFile';

const API_GET_USERS_ENDPOINT = `${domainBase}apiAdmin/v1/utility/getUserList`;
const API_GET_PACKAGES_ENDPOINT = `${domainBase}apiAdmin/v1/utility/getPackageList`;
const API_GET_PENDING_TICKETS_ENDPOINT = `${domainBase}apiAdmin/v1/utility/getPendingTicketList`;
const API_GET_ALL_MEMBERS_ENDPOINT = `${domainBase}/apiAdmin/v1/utility/getAllMemberList`;
const ACCESS_TOKEN = accessToken;

function DashUtilities() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPackages, setTotalPackages] = useState(0);
  const [pendingTickets, setPendingTickets] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(ACCESS_TOKEN,"accessTOken")
        const [usersResponse, packagesResponse, ticketsResponse, membersResponse] = await Promise.all([
          axios.get(API_GET_USERS_ENDPOINT, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }),
          axios.get(API_GET_PACKAGES_ENDPOINT, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }),
          axios.get(API_GET_PENDING_TICKETS_ENDPOINT, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }),
          axios.get(API_GET_ALL_MEMBERS_ENDPOINT, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }),
        ]);

        setTotalUsers(usersResponse.data.data.length);
        setTotalPackages(packagesResponse.data.data.length);
        setPendingTickets(ticketsResponse.data.data.length);
        setTotalMembers(membersResponse.data.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare the data array
  const data = [
    { name: 'Total Members', value: totalMembers },
    { name: 'Total Users', value: totalUsers },
    { name: 'Pending Tickets', value: pendingTickets },
    { name: 'Total Packages', value: totalPackages },
  ];

  // Single color for all bars
  const barColor = '#4BC0C0'; // Change this to your desired color

  return (
    <Box className="box-container"
      sx={{ p: 3, borderRadius: 2, backgroundColor: "background.paper" }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <BarChart
          width={1200}
          height={400}
          data={data}
          margin={{ top: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={barColor}>
            {/* Adding LabelList to show values above the bars */}
            <LabelList dataKey="value" position="top" style={{ fill: '#000', fontWeight: 'bold' }} />
          </Bar>
        </BarChart>
      </Box>
    </Box>
  );
}

export default DashUtilities;
