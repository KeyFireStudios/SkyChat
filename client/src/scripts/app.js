
var App = {
  Start: () => {
    App.RenderServers();
    App.UI.content.inputForm.attachment.onchange = event => {
      let formElem = App.UI.content.inputForm;
      let detachBtn = formElem.querySelector(".detachFileBtn");
      detachBtn.classList.remove("disabled");
      if (!detachBtn.onclick)
        detachBtn.onclick = e => {
          formElem.attachment.value = "";
          detachBtn.classList.add("disabled");
        };
    };
    App.UI.content.inputForm.msg.onkeypress = event => {
      App.test = event;
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        App.UI.content.inputForm.onsubmit();
      }
    };
  },
  UI: {
    nav: document.getElementsByTagName("nav")[0],
    header: {
      serverNameElem: document.getElementById("headerServerName"),
      serverCatergories: document.getElementById("headerBrowseServer"),
      serverCatergoryTemplate: "<div class=\"catergory\" id=\"catergory_{id}\"><span class=\"title\" onClick=\"this.parentNode.classList.toggle('hide');\">{name}<span class=\"channelUnreadCount\">{count}</span></span>{channels}</div>",
      serverChannelTemplate: "<div id=\"channel_{id}\" class=\"channel {active}\" onClick=\"App.RenderMessages({id});\">{name}</div>"
    },
    content: {
      chatHeader: document.querySelector(".channelName"),
      memberCount: document.querySelector(".memberCount"),
      chatWindow: {
        scrollElem: document.querySelector(".channelContent"),
        elem: document.querySelector(".channelChats")
      },
      inputForm: document.querySelector(".channelInput")
    },
    aside: {
      membersList: document.getElementById("membersList")
    }
  },
  ServerTree: [
    {
      Name: "SkyChat",
      Id: 423423,
      Icon: "./serverIcon.jpg",
      Catergories: [
        {
          Name: "Text Channels",
          Id: 417217,
          Channels: [
            {
              Name: "general",
              Id: 465279,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143248,
                  Content: "Hi"
                }
              ]
            },
            {
              Name: "discussion",
              Id: 913547,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143248,
                  Content: "Lemme get my debate papers..."
                }
              ]
            },
            {
              Name: "skynet",
              Id: 732867,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143248,
                  Content: "Stonks"
                }
              ]
            },
            {
              Name: "development",
              Id: 273754,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143248,
                  Content: "I got a error today..."
                },
                {
                  User: "Kaveman",
                  Id: 123456,
                  Content: "I hope its considered as progress"
                }
              ]
            },
            {
              Name: "help",
              Id: 357278,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143248,
                  Content: "Bro, I don't need help ._."
                },
                {
                  User: "Kaveman",
                  Id: 143249,
                  Content: "Actually maybe I do"
                }
              ]
            }
          ]
        },
        {
          Name: "Other channels",
          Id: 417518,
          Channels: [
            {
              Name: "off-topic",
              Id: 123456,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143248,
                  Content: "I shot a person today... in laser tag"
                }
              ]
            }
          ]
        }
      ],
      Members: [
        "Kaveman",
        "doggie"
      ]
    },
    {
      Name: "Test",
      Id: 123456,
      Icon: "",
      Catergories: [
        {
          Name: "Test Catergory",
          Id: 123456,
          Channels: [
            {
              Name: "test-channel",
              Id: 123456,
              Messages: [
                {
                  User: "Kaveman",
                  Id: 143243,
                  Content: "Hello world!"
                },
                {
                  User: "Kaveman",
                  Id: 143243,
                  Content: "Doggie this works!"
                },
                {
                  User: "Kaveman",
                  Id: 143249,
                  Content: "Problem is, these messages are hardcoded with JSON and we need a server to do some processing... and I need to build the message \"onReceive\" function, so I can sort messages into its correct channel XD (and add it to the screen if it is the selected channel)"
                },
                {
                  User: "Kaveman",
                  Id: 143249,
                  Content: "Problem is, these messages are hardcoded with JSON and we need a server to do some processing... and I need to build the message \"onReceive\" function, so I can sort messages into its correct channel XD (and add it to the screen if it is the selected channel)",
                  Attachment: {
                    Name: "New Text Document.txt",
                    Id: 12132117559350,
                    Size: 15
                  }
                }
              ]
            },
          ]
        }
      ],
      Members: [
        "Kaveman",
        "doggie",
        "test"
      ]
    }
  ],
  RenderServers: () => {
    var finalHtml = "";
    App.ServerTree.forEach((server, id) => {
      var serverIcon = server.Icon;
      var serverInitials = "";
      if (!serverIcon)
        server.Name.split(' ').forEach(e => serverInitials += e[0]);
      finalHtml += App.ServerIconTemplate.replace("{initials}", serverInitials.toUpperCase()).replace("{icon}", serverIcon).replaceAll("{id}", server.Id);
    });
    document.getElementById("serverElemList").innerHTML = finalHtml;
  },
  ServerIconTemplate: 
    "<a href=\"javascript:App.RenderChannels({id});\" id=\"server_{id}\">" +
      "{initials}" +
      "<div style=\"background-image: url('{icon}');\"></div>" +
    "</a>",
  RenderChannels: async serverId => {
    var serverElement = document.getElementById("server_" + serverId);
    if (serverElement.classList.contains("active"))
      return;
    var otherServer = App.UI.nav.getElementsByClassName("active")[0];
    if (otherServer && serverElement.id != otherServer.id)
      otherServer.classList.remove("active");
    serverElement.classList.add("active");
    try {
      var serverData = await App.FindServerWithId(serverId);
      
      App.UI.header.serverNameElem.innerText = serverData.Name;
      App.currentSet.serverData = serverData;

      var browseHtml = "";
      serverData.Catergories.forEach((catergory, catergoryIndex) => {
        var channelsHtml = "";
        catergory.Channels.forEach((channel, channelIndex) => {
          channelsHtml += App.UI.header.serverChannelTemplate
            .replaceAll("{id}", channel.Id)
            .replace("{active}", catergoryIndex == 0 && channelIndex == 0 ? "active" : "")
            .replace("{name}", channel.Name);
        });
        browseHtml += App.UI.header.serverCatergoryTemplate
          .replaceAll("{id}", catergory.Id)
          .replace("{name}", catergory.Name)
          .replace("{count}", catergory.Channels.length)
          .replace("{channels}", channelsHtml);
      });
      App.UI.header.serverCatergories.innerHTML = browseHtml;
      App.UI.header.serverCatergories.querySelector(".channel").onclick.call();
      
      var membersHtml = "";
      serverData.Members.forEach(member => {
        membersHtml += "<div class=\"entry\">{user}</div>"
          .replace("{user}", member);
      });
      App.UI.content.memberCount.innerText = serverData.Members.length;

      App.UI.aside.membersList.innerHTML = membersHtml;
    }
    catch {
      alert("Runtime Error: Server not found!");
    }
  },
  RenderMessages: async channelId => {
    // Get currently active channel
    var currentChannelElem = App.UI.header.serverCatergories.querySelector(".channel.active");
    if (App.currentSet.channelData.Id == channelId)
      return;
    
    App.UI.content.chatWindow.elem.innerHTML = string.Empty;
    var newChannelElem = App.UI.header.serverCatergories.querySelector("#channel_" + channelId);
    currentChannelElem.classList.remove("active");
    newChannelElem.classList.add("active");

    App.currentSet.channelData = await App.FindChannelWithId(App.currentSet.serverData, channelId);

    App.UI.content.chatHeader.innerText = App.currentSet.channelData.Name;

    // Set the messages
    var msgTemplate = 
      "<div id=\"msg_{id}\" class=\"chatEntry\">" +
        "<span>{user}</span>" +
        "<div>{msg}</div>" +
      "</div>";
    
    App.currentSet.channelData.Messages.forEach(msg => {
      console.log(msg);
      let baseElem = document.createElement("div");
      baseElem.setAttribute("id", "msg_" + msg.Id);
      baseElem.classList.add("chatEntry");

      let usernameField = document.createElement("span");
      usernameField.appendChild(document.createTextNode(msg.User));
      baseElem.appendChild(usernameField);
      
      let messageField = document.createElement("div");
      messageField.appendChild(document.createTextNode(msg.Content));
      baseElem.appendChild(messageField);

      if (msg.Attachment) {
        let fileAttachment = document.createElement("div");
        fileAttachment.classList.add("fileAttachment");
        {
          let fileDetails = document.createElement("div");
          fileDetails.classList.add("fileDetails");
          {
            let fileName = document.createElement("a");
            fileName.setAttribute("href", "/attachment/" + msg.Attachment.Id + "/" + msg.Attachment.Name);
            fileName.setAttribute("target", "_blank");
            fileName.appendChild(document.createTextNode(msg.Attachment.Name));
            fileDetails.appendChild(fileName);

            let fileSize = document.createElement("span");
            fileSize.classList.add("fileSize");
            fileSize.appendChild(document.createTextNode(msg.Attachment.Size + " bytes"));
            fileDetails.appendChild(fileSize);
          }
          fileAttachment.appendChild(fileDetails);

          let downloadBtn = document.createElement("a");
          downloadBtn.classList.add("downloadBtn");
          downloadBtn.setAttribute("href", "/attachment/" + msg.Attachment.Id + "/" + msg.Attachment.Name);
          downloadBtn.setAttribute("download", string.Empty);
          fileAttachment.appendChild(downloadBtn);
        }
        baseElem.appendChild(fileAttachment);
      }

      App.UI.content.chatWindow.elem.appendChild(baseElem);
    });
    let scrollElem = App.UI.content.chatWindow.scrollElem;
    scrollElem.scrollTop = scrollElem.scrollHeight - scrollElem.clientHeight;

  },
  createUid: () => {
    var date = new Date();
    return parseInt("" + date.getYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds());
  },
  FindServerWithId: serverId => new Promise((resolve, reject) => {
    App.ServerTree.forEach((server, id) => {
      if (server.Id == serverId)
        resolve(server);
      else if (++id == App.ServerTree.length)
        reject("Server not found!");
    });
  }),
  FindChannelWithId: (serverData, channelId) => new Promise((resolve, reject) => {
    serverData.Catergories.forEach((catergory, catergoryIndex) => {
      catergory.Channels.forEach((channel, channelIndex) => {
        if (channel.Id == channelId)
          resolve(channel);
        else if (++catergoryIndex == serverData.Catergories.length && ++channelIndex == catergory.Channels.length)
          reject("Channel not found");
      });
    });
  }),
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  currentSet: {
    serverData: {},
    channelData: {}
  },
  onMessageReceive: async (serverId, channelId, contentId, username, message, attachment) => {
    try {
      //c onsole.log("started");
      var serverData = await App.FindServerWithId(serverId);
      //c onsole.log("Found server: \n" + JSON.stringify(serverData, null, 2));
      var channelData = await App.FindChannelWithId(serverData, channelId);
      //c onsole.log("Found channel: \n" + JSON.stringify(channelData, null, 2));
      channelData.Messages.push({
        User: username,
        Id: contentId,
        Content: message,
        Attachment: attachment
      });

      // get current position of scroll, if it on bottom scroll down to make sure 
      // Add the message if it already exists
      if (App.currentSet.serverData.Id == serverId &&
          App.currentSet.channelData.Id == channelId) {
            let baseElem = document.createElement("div");
            baseElem.id = "msg_" + contentId;
            baseElem.classList.add("chatEntry");

            let usernameField = document.createElement("span");
            usernameField.innerText = username;
            baseElem.appendChild(usernameField);

            let messageField = document.createElement("div");
            messageField.innerText = message;
            baseElem.appendChild(messageField);

            let scrollElem = App.UI.content.chatWindow.scrollElem;
            let autoScroll = scrollElem.scrollHeight - 5 <= scrollElem.clientHeight + scrollElem.scrollTop;
            App.UI.content.chatWindow.elem.appendChild(baseElem);
            if (autoScroll)
              scrollElem.scrollTop = scrollElem.scrollHeight - scrollElem.clientHeight;
          }
          /*App.UI.content.chatWindow.elem.innerHTML += 
          ("<div id=\"msg_{id}\" class=\"chatEntry\">" +
            "<span>{user}</span>" +
            "<div>{msg}</div>" +
          "</div>"
          .replaceAll("{id}", contentId)
          .replace("{user}", username)
          .replace("{msg}", message));*/
    }
    catch (err) {
      console.log(err);
    }
  },
  InvokeSend: form => {
    var msgObject = form.msg;
    let fileObject = form.attachment;
    var file = fileObject.files[0];
    if (!msgObject.value && !attachment)
      return;
    
    let msgText = msgObject.value;
    //msgText = string.ToBase64(msgText);
    if (file) {
      let fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = event => {
        let finalMsg = string.ToBase64(msgObject.value.trim());
        let fileName = file.name;
        let fileContents = string.ToBase64(event.target.result);
        
        console.log(JSON.stringify({
          serverId: App.currentSet.serverData.Id,
          channelId: App.currentSet.channelData.Id,
          message: msgObject.value.trim(),
          fileName: file.name,
          fileData: event.target.result
        }, null, 2));
        //App.network.SendMessageRequest(
        //  App.currentSet.serverData.Id,  // serverId
        //  App.currentSet.channelData.Id, // channelId
        //  finalMsg,                      // message
        //  fileName,                      // attachment name
        //  fileContents                   // attachment data
        //);
        msgObject.value = "";
        App.UI.content.inputForm.querySelector(".detachFileBtn").onclick();
      };
      fileReader.onerror = event => {
        alert("File read error! Message not sent");
      };
    }
    else {
      let finalMsg = string.ToBase64(msgObject.value.trim());
      console.log(JSON.stringify({
        serverId: App.currentSet.serverData.Id,
        channelId: App.currentSet.channelData.Id,
        message: msgObject.value.trim()
      }, null, 2));
      msgObject.value = "";
      // App.network.SendMessageRequest(
      //  App.currentSet.serverData.Id,  // serverId
      //  App.currentSet.channelData.Id, // channelId
      //  finalMsg,                      // message
      //  string.Empty                   // attachment name (none)
      //  string.Empty                   // attachment data (none)
      //);
    }
  },
  network: {
    // doggie, your up
  }
};

const string = {
  ToBase64: string => btoa(string),
  FromBase64: base64String => atob(base64String),
  Empty: ""
}
  
console.log("Yeah... DevTools (aka inspect element) is where it all starts. Long ago, when it was still called hacking, and you you enthusiastic to show your friends that you \"hacked\" a site and made it show something else. But in the present day, that is not the case now is it. Instead you found and felt the power of development and now, you can make stuff. Don't give up and have fun in the matrix :D");