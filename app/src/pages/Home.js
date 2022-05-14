import {Box} from "@mui/material";
import Nav from "../components/UI/nav/nav.js";
import LineChart from "../components/createChart/createLineChart.js";
const Home = (props) => {
    
    return(
        <Box sx={{width:"100vw", minHeight:"100vh", backgroundColor:"#555"}}>
            <Nav></Nav>
            <Box sx={{p:5, mt:10}}>
                <Box sx={{p:5, mt:10, backgroundColor:"#222", borderRadius:3}}>
                    <LineChart></LineChart>
                    {/* <CreateLineChart></CreateLineChart> */}
                </Box>
            </Box>
        </Box>
    )
}

export default Home;