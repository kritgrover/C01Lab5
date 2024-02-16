test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  // Clear the DB for the next test
  delAll();

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added successfully.");
});

// Added Test Case
test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesRes.status).toBe(200);
  expect(Array.isArray(getAllNotesBody.response)).toBe(true);
  expect(getAllNotesBody.response.length).toBe(0);
});

// Added Test Case
test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  for (let i = 0; i < 2; i++) {
    const res = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `test${i + 1}`,
        content: `test${i + 1}`,
      }),
    });

    const resBody = await res.json();
    expect(res.status).toBe(200);
    expect(resBody.response).toBe("Note added successfully.");
  }

  const getTwoNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const getTwoNotesBody = await getTwoNotesRes.json();

  // Clearing DB for next test
  delAll();

  expect(getTwoNotesRes.status).toBe(200);
  expect(Array.isArray(getTwoNotesBody.response)).toBe(true);
  expect(getTwoNotesBody.response.length).toBe(2);
});

// Added Test Case
test("/deleteNote - Delete a note", async () => {
  const res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `test3`,
      content: `test3`,
    }),
  });

  const resBody = await res.json();
  const noteId = resBody.insertedId;
  expect(res.status).toBe(200);
  expect(resBody.response).toBe("Note added successfully.");

  const deleteANoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteANoteBody = await deleteANoteRes.json();
  expect(deleteANoteRes.status).toBe(200);
  expect(deleteANoteBody.response).toBe(`Document with ID ${noteId} deleted.`);
});

// Added Test Case
test("/patchNote - Patch with content and title", async () => {
  const res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Inital note from pathBoth`,
      content: `Inital content from patchBoth`,
    }),
  });

  const resBody = await res.json();
  const noteIdpct = resBody.insertedId;
  expect(res.status).toBe(200);
  expect(resBody.response).toBe("Note added successfully.");

  const fullPathRes = await fetch(`${SERVER_URL}/patchNote/${noteIdpct}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Patched Note",
      content: "Patched Content",
    }),
  });

  const fullPatchBody = await fullPathRes.json();

  // Clear the DB for the next test
  delAll();

  expect(fullPathRes.status).toBe(200);
  expect(fullPatchBody.response).toBe(`Document with ID ${noteIdpct} patched.`);
});

test("/patchNote - Patch with just title", async () => {
  const res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Inital note from patchTitle`,
      content: `Inital content from patchTitle`,
    }),
  });

  const resBody = await res.json();
  const noteIdpt = resBody.insertedId;
  expect(res.status).toBe(200);
  expect(resBody.response).toBe("Note added successfully.");

  const titlePathRes = await fetch(`${SERVER_URL}/patchNote/${noteIdpt}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Patched title",
    }),
  });

  const titlePatchBody = await titlePathRes.json();
  expect(titlePathRes.status).toBe(200);
  expect(titlePatchBody.response).toBe(`Document with ID ${noteIdpt} patched.`);
});

// Added Test Case
test("/patchNote - Patch with just content", async () => {
  const res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Inital note from patchContent`,
      content: `Inital content from patchContent`,
    }),
  });

  const resBody = await res.json();
  const noteIdpc = resBody.insertedId;
  expect(res.status).toBe(200);
  expect(resBody.response).toBe("Note added successfully.");

  const contentPatchRes = await fetch(`${SERVER_URL}/patchNote/${noteIdpc}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "Patched content",
    }),
  });

  const contentPatchBody = await contentPatchRes.json();
  expect(contentPatchRes.status).toBe(200);
  expect(contentPatchBody.response).toBe(
    `Document with ID ${noteIdpc} patched.`
  );
});

// Added Test Case
test("/deleteAllNotes - Delete one note", async () => {
  // Clearing DB before running intended test
  delAll();

  const res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `test4`,
      content: `test4`,
    }),
  });

  expect(res.status).toBe(200);
  const resBody = await res.json();
  expect(resBody.response).toBe("Note added successfully.");

  const deleteOneNoteRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteOneNoteBody = await deleteOneNoteRes.json();
  expect(deleteOneNoteRes.status).toBe(200);
  expect(deleteOneNoteBody.response).toBe("1 note(s) deleted.");
});

// Added Test Case
test("/deleteAllNotes - Delete three notes", async () => {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `test${i + 1}`,
        content: `test${i + 1}`,
      }),
    });

    const resBody = await res.json();
    expect(res.status).toBe(200);
    expect(resBody.response).toBe("Note added successfully.");
  }

  const deleteANoteRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deleteANoteBody = await deleteANoteRes.json();
  expect(deleteANoteRes.status).toBe(200);
  expect(deleteANoteBody.response).toBe("3 note(s) deleted.");
});

// Added Test Case
test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `test5`,
      content: `test5`,
    }),
  });

  const resBody = await res.json();
  expect(res.status).toBe(200);
  const colourChangeNoteID = resBody.insertedId;
  expect(resBody.response).toBe("Note added successfully.");

  // Test colour
  let colour = "#afd332";

  const patchColourRes = await fetch(
    `${SERVER_URL}/updateNoteColor/${colourChangeNoteID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ colour }),
    }
  );

  const patchColourBody = await patchColourRes.json();
  expect(patchColourRes.status).toBe(200);
  expect(patchColourBody.message).toBe("Note color updated successfully.");

  // Clear DB for next test
  delAll();
});

// Helper Function
const delAll = async () => {
  const delRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    body: {
      "Content-Type": "application/json",
    },
  });

  const delBody = await delRes.json();
};
