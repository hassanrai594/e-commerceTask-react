import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CardActionArea } from '@mui/material';

import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';

export default function App() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axios.get('./data.json')
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch((error) => {
                setError(error);
            });
    }, []);

    const filterData = useCallback(() => {
        let updatedData = data;

        if (category) {
            updatedData = updatedData.filter((product) => product.category === category);
        }

        if (searchQuery) {
            updatedData = updatedData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredData(updatedData);
    }, [data, category, searchQuery]);

    useEffect(() => {
        filterData();
    }, [category, searchQuery, filterData]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleSearchCategory = (event, value) => {
        setSearchQuery(value);
    };

    const handleAddingCart = (product) => {
        setCart((prevcart) => {
            const existingProduct = prevcart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevcart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevcart, { ...product, quantity: 1 }];
            }
        });
    }

    // Quantity number Input
    const CustomNumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
        return (
            <BaseNumberInput
                slots={{
                    root: StyledInputRoot,
                    input: StyledInputElement,
                    incrementButton: StyledButton,
                    decrementButton: StyledButton,
                }}
                slotProps={{
                    incrementButton: {
                        children: '▴',
                    },
                    decrementButton: {
                        children: '▾',
                    },
                }}
                {...props}
                ref={ref}
            />
        );
    });

    const blue = {
        100: '#DAECFF',
        200: '#80BFFF',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        700: '#0059B2',
    };

    const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
    };

    const StyledInputRoot = styled('div')(
        ({ theme }) => `
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 400;
        border-radius: 8px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
            };
        display: grid;
        grid-template-columns: 1fr 19px;
        grid-template-rows: 1fr 1fr;
        overflow: hidden;
        column-gap: 8px;
        padding: 4px;
      
        &.${numberInputClasses.focused} {
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
        }
      
        &:hover {
          border-color: ${blue[400]};
        }
      
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    const StyledInputElement = styled('input')(
        ({ theme }) => `
        font-size: 0.875rem;
        font-family: inherit;
        font-weight: 400;
        line-height: 1.5;
        grid-column: 1/2;
        grid-row: 1/3;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: inherit;
        border: none;
        border-radius: inherit;
        padding: 8px 12px;
        outline: 0;
      `,
    );

    const StyledButton = styled('button')(
        ({ theme }) => `
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        appearance: none;
        padding: 0;
        width: 19px;
        height: 19px;
        font-family: system-ui, sans-serif;
        font-size: 0.875rem;
        line-height: 1;
        box-sizing: border-box;
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 0;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 120ms;
      
        &:hover {
          background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
          border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
          cursor: pointer;
        }
      
        &.${numberInputClasses.incrementButton} {
          grid-column: 2/3;
          grid-row: 1/2;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border: 1px solid;
          border-bottom: 0;
          border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
          background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
          color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      
          &:hover {
            cursor: pointer;
            color: #FFF;
            background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
            border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
          }
        }
      
        &.${numberInputClasses.decrementButton} {
          grid-column: 2/3;
          grid-row: 2/3;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          border: 1px solid;
          border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
          background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
          color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
        }
      
        &:hover {
          cursor: pointer;
          color: #FFF;
          background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
          border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
        }
      
        & .arrow {
          transform: translateY(-1px);
        }
      
        & .arrow {
          transform: translateY(-1px);
        }
      `,
    );

    const handleProductQuantity = (index,newQuantity)=>{
        setCart((prevCart)=>{
            prevCart.map((item,i)=> 
                i === index ? {...item,quantity:newQuantity} : item
            )
        });
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const options = data.map((item) => item.name);

    return (
        <>
            <div className='container px-4 py-4'>
                <Typography className='text-center text-blue-800 !font-medium' variant="h4" gutterBottom>
                    Products Website
                </Typography>

                <div className='flex flex-row mb-9 items-center gap-2'>
                    <div className='basis-1/2 '>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            className='!w-full'
                            options={options}
                            value={searchQuery}
                            onChange={handleSearchCategory}
                            sx={{ width: 300 }}
                            isOptionEqualToValue={(option, value) => option === value || value === ''}
                            renderInput={(params) => <TextField {...params} label="Products" />}
                        />
                    </div>

                    <div className='basis-1/2 '>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Category"
                                value={category}
                                onChange={handleChangeCategory}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Category A">Category A</MenuItem>
                                <MenuItem value="Category B">Category B</MenuItem>
                                <MenuItem value="Category C">Category C</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <Box sx={{ width: '100%' }} className="pb-7">
                    <Grid container spacing={2}>
                        {filteredData.map((product) => (
                            <Grid item xs={12} sm={6} md={3} key={product.id}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea onClick={() => handleAddingCart(product)}>
                                        <CardMedia
                                            className='h-80'
                                            component="img"
                                            alt={product.name}
                                            image={product.image}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="">
                                                {product.name}
                                            </Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {`${product.price} $`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Typography className='text-center text-blue-800 !font-medium !mt-5' variant="h4" gutterBottom>
                    Cart
                </Typography>

                <div className='border border-solid border-slate-300 rounded-xl p-3'>
                    <table className="cart-item w-full">
                        <thead>
                            <tr>
                                <th className='text-start pb-2'>Product</th>
                                <th className='text-start pb-2 ps-3'>Name</th>
                                <th className='text-start pb-2 ps-3'>Quantity</th>
                                <th className='text-start pb-2 ps-3'>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td className='w-1/12 py-3 border-b-2'>
                                        <img className='rounded-xl w-20 h-20 me-3' src={item.image} alt={item.name} />
                                    </td>

                                    <td className='w-6/12 ps-3 py-3 border-b-2'>
                                        <Typography variant="h6">{item.name}</Typography>
                                    </td>

                                    <td className='w-1/5 ps-3 py-3 border-b-2'>
                                        <div className='productQuantity'>
                                            <CustomNumberInput placeholder="Type a number…" value={item.quantity} onChange={(event) => handleProductQuantity(index, Number(event.target.value))} />
                                        </div>
                                    </td>

                                    <td className='ps-3 py-3 border-b-2 priceProduct'>
                                        <Typography variant="body2" className='!text-xl !font-semibold'>{`${item.price * item.quantity} $`}</Typography>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='text-right mt-4'>
                        <Typography variant="h6" className='!text-xl !font-semibold pe-5'>{`Total: ${calculateTotalPrice()} $`}</Typography>
                    </div>
                </div>
            </div>
        </>
    );
}
