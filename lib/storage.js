import { AsyncStorage } from 'react-native'
// var JSON = require('circular-json-es6')

const getData = async ({ cache, firstStep, steps }, callback) => {
  const currentStep = firstStep;
  const renderedSteps = [steps[currentStep.id]];
  const previousSteps = [steps[currentStep.id]];
  const previousStep = {};
  let response;
  let datab;
   response =  await AsyncStorage.getItem('rsc_cache').then(data => JSON.parse(data));
   console.log(response);
  if (cache && response) {
    let data = await JSON.parse(response) || []
       console.log(data);

    const lastStep = data.renderedSteps[data.renderedSteps.length - 1];

    if (lastStep && lastStep.end) {
      AsyncStorage.removeItem('rsc_cache');
    } else {
      for (let i = 0; i < data.renderedSteps.length; i += 1) {
        // remove delay of cached rendered steps
        data.renderedSteps[i].delay = 0;
        // flag used to avoid call triggerNextStep in cached rendered steps
        data.renderedSteps[i].rendered = true;

        // an error is thrown when render a component from AsyncStorage.
        // So it's necessary reassing the component
        if (data.renderedSteps[i].component) {
          const id = data.renderedSteps[i].id;
          data.renderedSteps[i].component = steps[id].component;
        }
      }

      // execute callback function to enable input if last step is
      // waiting user type
      if (data.currentStep.user) {
        callback();
      }

      return data;
    }
  }

  return {
    currentStep,
    previousStep,
    previousSteps,
    renderedSteps,
  };
};

const setData = async (data) => {
  await AsyncStorage.setItem('rsc_cache', JSON.stringify(data));
};

export {
  getData,
  setData,
};
