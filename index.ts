import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.4.0/mod.ts";

import {
  APIApplicationCommandInteraction,
  APIPingInteraction,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "https://raw.githubusercontent.com/discordjs/discord-api-types/main/deno/v9.ts";

import { getRedis } from "./redis.ts";
import { verifySignature } from "./verify.ts";

serve({
  "/": home,
});

async function home(request: Request) {
  const { error } = await validateRequest(request, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });

  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  const { valid, body } = await verifySignature(request);

  if (!valid) {
    return json(
      { error: "Invalid request" },
      {
        status: 401,
      }
    );
  }

  const interaction = (await JSON.parse(body)) as
    | APIPingInteraction
    | APIApplicationCommandInteraction;

  if (interaction.type === InteractionType.Ping) {
    return json({
      type: InteractionResponseType.Pong,
    });
  }

  switch (interaction.data.name) {
    case "command here!": {
      // Do something!
      const data = await getRedis("example_key");

      return json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: data,
        },
      });
    }

    default: {
      return json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: "Hey! I don't have a command for that yet :(",
        },
      });
    }
  }
}
