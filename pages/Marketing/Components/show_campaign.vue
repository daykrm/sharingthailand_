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
            <div
              class="fb-share-button"
              data-href="https://sharingthailand.com/Marketing/Campaign"
              data-layout="button_count"
              data-size="small"
            >
              <a
                target="_blank"
                href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fhug.lvh.me%3A3000%2FMarketing%2FCampaign&amp;src=sdkpreparse"
                class="fb-xfbml-parse-ignore"
                >Share</a
              >
            </div>
            <v-spacer></v-spacer>
            <font style="font-size: 0.8em">สิ้นสุดใน 00d:00h:00m:00s</font>
          </v-row>
          <v-row>
            {{ title }}
            <v-btn class="ml-2" small>แชร์</v-btn>
            <v-spacer></v-spacer>
            <font style="font-size: 0.8em">สิ้นสุดใน 00d:00h:00m:00s</font>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <div id="fb-root"></div>
    <script
      async
      defer
      crossorigin="anonymous"
      src="https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v8.0"
      nonce="YLgt3tL7"
    ></script>
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
