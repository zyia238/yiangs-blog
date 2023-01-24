import { useRef } from 'react'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';

interface DropdownTabsProps {
    title:string;
    emoji:string;
    content:string;
}



const DropdownTabs = ({title,emoji,content}:DropdownTabsProps) => {
    const expandProperty = useRef<string>('expanded')
    return (
        <>
            <section className='accordion'>
                 <Accordion >
                    <AccordionSummary
                    expandIcon={<KeyboardArrowRightTwoToneIcon fontSize='small'/>}
                    aria-controls="panel1a-content"
                    classes={{
                        [expandProperty.current]: {
                            margin:0
                        },
                    }}
                    >
                        <Typography sx={{
                            fontSize:'13px',
                            fontWeight:500,
                        }}>{title}</Typography>
                        <span style={{
                            fontSize:'13px',
                            lineHeight:'1rem',
                            marginLeft:'-0.6rem'
                        }}>{emoji}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {content}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </section>
            
        </>
    )
}

export default DropdownTabs