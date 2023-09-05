import { sendGChatMessage } from 'common/func';

export const sendDailyMeetingNotify = async (
  gChatWebhook: string,
  { id, alias }: { id: string; alias: string },
  members: string[] = [],
) => {
  const membersQuery = members
    .map((mem) => (mem === alias ? `_${mem}` : mem))
    .join('@');
  const membersEncoded = encodeURIComponent(membersQuery);
  return await sendGChatMessage(gChatWebhook, {
    text: `Hi <users/${id}>!`,
    cardsV2: [
      {
        cardId: 'card01',
        card: {
          header: {
            title: 'Daily Meeting Reminder',
            subtitle: `Hosted by @${alias}`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: 'Today is <b>your turn</b> to <b>host the Daily Meeting</b>!<br/>So please <b>take your time</b> to <b>prepare to have a good meeting</b>!',
                  },
                },
                {
                  divider: {},
                },
                {
                  textParagraph: {
                    text: `<i>And remember that we have the Daily Meeting at 9am (after 15 mins)</i><br/>If he off today, click the <b>Get a new member</b> to get a new random member to host this meeting! <a href="https://team.nqhuy.dev/p/tools/random/${membersEncoded}">Ex</a>"`,
                  },
                },
                {
                  divider: {},
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: 'Join meeting',
                        onClick: {
                          openLink: {
                            url: 'https://meet.google.com',
                          },
                        },
                        color: {
                          red: 0.7412,
                          green: 0.0941,
                          blue: 0.4549,
                        },
                      },
                      {
                        text: 'Check calendar',
                        onClick: {
                          openLink: {
                            url: 'https://calendar.google.com',
                          },
                        },
                      },
                      {
                        text: 'Get a new member',
                        onClick: {
                          openLink: {
                            url: `https://team.nqhuy.dev/p/tools/random/${membersEncoded}`,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  });
};
