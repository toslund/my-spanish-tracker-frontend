<template>
  <div class="container">
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
/* eslint-disable */
import Chart from 'chart.js/auto';

export default {
  name: 'ProgressChart',
  props: {
    predictions: Array,
  },
  data() {
    return {
      resetting: false,
      cursor: 'default',
      filter: false,
      labels: [],
      info: null,
      posts: null,
      conversionFactor: 20,
      staticBackgroundColors: {
        gas: 'rgba(255, 99, 132, 0.2)',
        bureaucratic: 'rgba(255, 159, 64, 0.2)',
        'eating out': 'rgba(255, 205, 86, 0.2)',
        groceries: 'rgba(54, 162, 235, 0.2)',
        lodging: 'rgba(75, 192, 192, 0.2)',
        water: 'rgba(54, 162, 235, 0.2)',
        other: 'rgba(153, 102, 255, 0.2)',
      },
      backgroundColors: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ],
      staticBorderColors: {
        total: 'rgb( 0, 0, 0)',
        gas: 'rgb(255, 99, 132)',
        bureaucratic: 'rgb(255, 159, 64)',
        'eating out': 'rgb(255, 205, 86)',
        groceries: 'rgb(54, 162, 235)',
        lodging: 'rgb(75, 192, 192)',
        water: 'rgb(54, 162, 235)',
        other: 'rgb(153, 102, 255)',
      },
      borderColors: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ],
      spareBackgroundColor: 'rgba(201, 203, 207, 0.2)',
      spareBorderColor: 'rgb(201, 203, 207)',
    };
  },
  computed: {
    predictionsData() {
      const data = [];
      this.predictions.forEach((prediction) => { data.push(prediction.total_predicted_correct) });
      return data;
    },
    predictionsLabels() {
      const labels = [];
      for (let i = 0; i < this.predictions.length; i += 1) {
        labels.push(i + 1);
      }
      return labels;
    },
    // byDayChart() {
    //   console.log('BY DAY CHART COMPUTED!!!!');
    //   const data = {
    //     labels: Object.keys(this.rowsByDay),
    //     datasets: []
    //   };
    //   // Loop through all the categories and add them as a dataset and populate that dataset
    //   const categories = [...this.activeCategories, 'total']
    //   console.log(`categories for looping: ${categories}`);
    //   for (var i = 0; i < categories.length; i++) {
    //     const category = categories[i];
    //     console.log(`adding dataset for ${category}`)
    //     data.datasets.push({
    //       label: category,
    //       data: data.labels.map((day) => this.categoriesByDay[day][category]),
    //       fill: false,
    //       borderColor: this.getColor(category),
    //       tension: 0.1,
    //       hidden: category === 'total' ? true : false,
    //     });                          
    //   }
    //   return data;
    // },
  },
  watch: {
    // byDayChart: {
    //   handler() {
    //     if (this.lineChart) {
    //       this.refreshChart();
    //     }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    renderChart() {
      const lineChartCtx = document.getElementById('line-chart').getContext('2d');;
      // eslint-disable-next-line
      if (this.lineChart) { this.lineChart.destroy() }
      this.lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
          labels: this.predictionsLabels,
          datasets: [{
              label: 'Prediction through time',
              data: this.predictionsData,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
      },
      });
    },
    resetChart() {
      if( this.resetting ) { return }
      this.resetting = true
      console.log('start reset');
      console.log(this.lineChart);
      this.lineChart.reset();
      this.resetting = false;
      console.log('finsish reset');
    },
    refreshChart() {
      if (this.lineChart != null) {
        console.log(this.lineChart.data.datasets);
        this.lineChart.data.datasets.splice(0,this.lineChart.data.datasets.length);
        this.byDayChart.datasets.forEach((dataset) => this.lineChart.data.datasets.push(JSON.parse(JSON.stringify(dataset))));
        this.lineChart.update();
      }
    },
    handleMouseDown(event){
      console.log(event);
      // console.log(this.chart.config.data.labels);
      console.log(this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true));
      if (this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true).length) {
        const index = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)[0].index;
        const category = this.chart.config.data.labels[index];
        console.log(category);
      }
      // const ctx = document.getElementById('planet-chart');
      // console.log(ctx);
    },
    getColor(category) {
      // console.log(`getting color for ${category}`);
      // console.log(Object.prototype.hasOwnProperty.call(this.staticBorderColors, category));
      if (Object.prototype.hasOwnProperty.call(this.staticBorderColors, category)) {
        return this.staticBorderColors[category];
      } else {return this.spareBorderColor;}
    },
    addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
    },
  },
  created() {
    this.lineChart = null;
  },
  mounted() {
    this.renderChart();
  },
  beforeUnmount() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container {
  max-width: 1000px;
}
</style>
