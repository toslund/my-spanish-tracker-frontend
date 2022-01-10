<template>
    <canvas :id="canvasid"></canvas>
</template>

<script>
/* eslint-disable */
import Chart from 'chart.js/auto';

export default {
  name: 'ProgressChart',
  props: {
    bins: Array,
    canvasid: String,
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
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'width: 100%;' //220
        case 'sm': return 'width: 400px;' //400
        case 'md': return 'width: 500px;' //500
        case 'lg': return 'width: 600px;' //600
        case 'xl': return 'width: 800px;' //800
      }
    },
    predictionsData() {
      const data = [];
      this.bins.forEach((bin) => {
        data.push((bin.correct.length/bin.total.length)*100)
      });
      return data;
    },
    predictionsLabels() {
      const labels = [];
      this.bins.forEach((bin) => {
        labels.push(`${bin.bottom_rank}-${bin.top_rank}`)
      });
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
    //     if (this.barChart) {
    //       this.refreshChart();
    //     }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    renderChart() {
      const barChartCtx = document.getElementById(this.canvasid).getContext('2d');;
      // eslint-disable-next-line
      if (this.barChart) { this.barChart.destroy() }
      this.barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
          labels: this.predictionsLabels,
          datasets: [{
              label: 'Results by Ranked Words',
              data: this.predictionsData,
              backgroundColor: [
                  'rgba(0, 215, 31, 0.2)',
                  'rgba(84, 223, 20, 0.2)',
                  'rgba(168, 232, 10, 0.2)',
                  'rgba(253, 241, 0, 0.2)',
                  'rgba(253, 192, 0, 0.2)',
                  'rgba(253, 144, 0, 0.2)',
                  'rgba(254, 96, 0, 0.2)',
                  'rgba(254, 48, 0, 0.2)',
                  'rgba(255, 0, 0, 0.2)',
              ],
              borderColor: [
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
                  'rgba(200, 200, 200, 1)',
              ],
              borderWidth: 1
          }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Grouped Word Frequency by Percentage Correct',
          }
        },
        legend: {
          display: false
        },
        scales: {
            y: {
                beginAtZero: true,
                display: true,
                text: 'Your Title',
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return value + '%';
                    }
                }
            }
        }
      },
      });
    },
    resetChart() {
      if( this.resetting ) { return }
      this.resetting = true
      console.log('start reset');
      console.log(this.barChart);
      this.barChart.reset();
      this.resetting = false;
      console.log('finsish reset');
    },
    refreshChart() {
      if (this.barChart != null) {
        console.log(this.barChart.data.datasets);
        this.barChart.data.datasets.splice(0,this.barChart.data.datasets.length);
        this.byDayChart.datasets.forEach((dataset) => this.barChart.data.datasets.push(JSON.parse(JSON.stringify(dataset))));
        this.barChart.update();
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
    this.barChart = null;
  },
  mounted() {
    console.log(this.bins);
    this.renderChart();
  },
  beforeUnmount() {
    if (this.barChart) {
      this.barChart.destroy();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
