const Utils = {
  quotesText: (text: string) => {
    const lines = text.replace(/>/g, "").split("\n");
    return lines
      .map((line, index) => (index === 0 ? ">" : ">\t") + line)
      .join("\n");
  },
  parseRequest: (body: { team_id: string, user_id: string, text: string }) => {
    const teamId = body.team_id;
    const userId = body.user_id;
    const text = body.text;
    const isValid = !(!teamId || !userId || text === undefined);
    return {
      isValid,
      teamId,
      userId,
      text,
    };
  },
};

export default Utils;
