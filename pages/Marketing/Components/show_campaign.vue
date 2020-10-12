<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12" md="5">
          <v-img
            max-width="800"
            src="http://via.placeholder.com/800x240"
          ></v-img>
        </v-col>
        <v-col cols="12" md="7">
          <v-row>
            {{ title }}
            <v-btn class="ml-2" small>แชร์</v-btn>
            <v-spacer></v-spacer>
            <font style="font-size:0.8em">สิ้นสุดใน 00d:00h:00m:00s</font>
          </v-row>
          <v-row>
            {{ title }}
            <v-btn class="ml-2" small>แชร์</v-btn>
            <v-spacer></v-spacer>
            <font style="font-size:0.8em">สิ้นสุดใน 00d:00h:00m:00s</font>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  name: 'show-campaign',
  props: {
    title: {
      type: String,
      default: 'xoxoxoxox oxoxoxo oxoxoxoox',
    },
  },
}
</script>
