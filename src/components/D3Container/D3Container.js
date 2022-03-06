import { Divider, Grid, Typography } from '@mui/material';
import React, {
  createContext, useContext, useState, useEffect,
} from 'react';
import { DatastoreContext } from '../../layouts/Dashboard';
import ChartBar from './ChartBar';
import D3Chart from './D3Chart';
import D3Filter from './D3Filter';
import { initialMeasureScores } from '../../context/DataValidation';

export const currentFilterContext = createContext([])
export const firstRenderContext = createContext(true)

function D3Container() {
  const { datastore, setDatastore } = useContext(DatastoreContext);
  const [displayData, setDisplayData] = useState(initialMeasureScores);
  const [currentFilters, setCurrentFilters] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  const workingList = [];
  datastore.results.forEach((item) => workingList.push(item.measure));
  const measureList = Array.from(new Set(workingList));

  useEffect(() => {
    setDisplayData(datastore.results);
  }, [datastore]);

  const changeFunction = (filter) => {
    const filterArray = [...currentFilters];
    // Will need to be adjusted once model data is available.
    const active = filterArray.find((item) => item.type === 'measure' && item.value === filter.value);
    if (active !== undefined) {
      const newFilterArray = filterArray.filter((item) => item.value !== filter.value);
      setCurrentFilters(newFilterArray);
      setDisplayData(refineDisplayData([...datastore.results], newFilterArray));
    } else {
      const newFilter = {
        value: filter.value,
        type: 'measure',
      }
      filterArray.push(newFilter);
      setCurrentFilters(filterArray);
      setDisplayData(refineDisplayData([...datastore.results], filterArray));
    }
  }

  const refineDisplayData = (data, filters) => {
    const initialData = data;
    let workingData = [];
    const filterArray = filters;
    if (filterArray.length === 0) {
      workingData = initialData;
    } else if (filterArray.length === measureList.length) {
      workingData = [];
    } else {
      workingData = initialData;
      filterArray.forEach((filterItem) => {
        // Handles Filtering by measure
        if (filterItem.type === 'measure') {
          workingData.forEach((item, index, object) => {
            if (item.measure === filterItem.value) {
              object.splice(index, 1);
            }
          });
        }
        // TODO: Add logic in here for various filter types
      })
    }
    return workingData;
  }

  return (
    <div>
      <currentFilterContext.Provider value={{ currentFilters, setCurrentFilters }}>
        <firstRenderContext.Provider value={{ firstRender, setFirstRender }}>

          <Grid container justifyContent="space-evenly" direction="column">
            <Grid sx={{ mb: '-30px' }} item>
              <ChartBar />
            </Grid>
            <Grid item>
              <D3Chart displayData={displayData} />
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={0.25}>
            <Grid container item justifyContent="space-evenly" direction="row" alignItems="center" spacing={2} sx={{ width: '100%', p: '3px', m: '2px' }}>
              <Grid item xs={1}>
                <Typography>
                  Measure
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  Included
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  Eligible Population
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  Numerator
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  Denominator
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  Exclusions
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>
                  View
                </Typography>
              </Grid>
            </Grid>
            {measureList.map((item, index) => {
              const craftedKey = `chart-container-grid-measure-${index}`;
              const filter = {
                value: item,
                type: 'measure',
                included: Math.round(Math.random() * 10000),
                eligible: Math.round(Math.random() * 10000),
                numerator: Math.round(Math.random() * 10000),
                denominator: Math.round(Math.random() * 10000),
                exclusions: Math.round(Math.random() * 10000),
              }
              return (
                <Grid
                  item
                  sx={{ width: '100%' }}
                  key={craftedKey}
                >
                  <D3Filter filter={filter} changeFunction={() => changeFunction(filter)} />
                </Grid>
              )
            })}
            <Divider color="black" />
          </Grid>
        </firstRenderContext.Provider>
      </currentFilterContext.Provider>
    </div>
  )
}

export default D3Container;
