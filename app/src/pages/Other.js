import {Box} from "@mui/material";
import Nav from "../components/UI/nav/nav.js";
// import LineChart from "../chart/lineChart.js";
const Others = (props) => {
    
    return(
        <Box sx={{width:"100vw", height:"100vh", backgroundColor:"#555"}}>
            <Nav></Nav>
            <h3>Nothing here</h3>
            {/* <LineChart></LineChart> */}
        </Box>
    )
}

export default Others;