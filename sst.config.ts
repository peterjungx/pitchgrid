import type { SSTConfig } from "sst";
import { SvelteKitSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "pitchgrid",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new SvelteKitSite(stack, "site", {
        customDomain: "pitchgrid.io",
        //assets:{
        //  fileOptions:[
        //    {
        //      files: "**/*.pdf",
        //      cacheControl:"public",
        //      contentType:"application/pdf",
        //    },
        //    {
        //      files: "**/*.vcv",
        //      cacheControl:"public",
        //      contentType:"application/x-vcv",
        //    },
        //    {
        //      files: "**/docs/*",
        //      cacheControl:"public",
        //      contentType:"text/html",
        //    }
        //  ]
        //}
      });
      stack.addOutputs({
        url: site.url,
      });
    });
  },
} satisfies SSTConfig;
