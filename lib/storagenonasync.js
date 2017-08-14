var localstoragex = require('react-native-local-storage');

const getData = ({ cache, firstStep, steps }, callback) => {
  const currentStep = firstStep;
  const renderedSteps = [steps[currentStep.id]];
  const previousSteps = [steps[currentStep.id]];
  const previousStep = {};
  // var a='{"a":7}';
  // console.log(JSON.parse(a));
  let response;

   response =  localstoragex.get('rsc_cache').then((data) => { return data});
  //  response =  localstoragex.get('rsc_cache').then((data) => { return JSON.parse(data)});
   console.log(response);
  if (cache && response) {
    const data = JSON.parse(response)
       console.log(data);
       console.log(response);

    const lastStep = data.renderedSteps[data.renderedSteps.length - 1];

    if (lastStep && lastStep.end) {
      localstoragex.remove('rsc_cache');
    } else {
      for (let i = 0; i < data.renderedSteps.length; i += 1) {
        // remove delay of cached rendered steps
        data.renderedSteps[i].delay = 0;
        // flag used to avoid call triggerNextStep in cached rendered steps
        data.renderedSteps[i].rendered = true;

        // an error is thrown when render a component from localstoragex.
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

const setData = (data) => {
  localstoragex.save('rsc_cache', JSON.stringify(data));
};

export {
  getData,
  setData,
};
