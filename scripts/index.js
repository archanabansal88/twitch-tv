var config = {
  BASE_URL: 'https://wind-bow.gomix.me/twitch-api/'
}

var Utility = (function () {
  function makeAjaxRequest (url) {
    return $.ajax({
      url: url,
      jsonp: 'callback',
      dataType: 'jsonp'
    })
  }
  return {
    ajaxRequest: makeAjaxRequest
  }
})()

const TwitchTv = (function () {
  class TwitchTv {
    constructor (option, list) {
      this.arr = [
        'ESL_SC2',
        'OgamingSC2',
        'cretetion',
        'freecodecamp',
        'storbeck',
        'habathcx',
        'RobotCaleb',
        'noobs2ninjas'
      ]
      this.obj = {}
      this.count = 0
      this.option = option
      this.list = list
      this.init()
    }
    init () {
      this.attachEvent()
      this.getChannelInfo()
    }
    attachEvent () {
      this.option.on('click', '.options', this.handleClick.bind(this))
    }
    handleClick (e) {
      let $target = $(e.target)
      const online = this.list.find('.online')
      const offline = this.list.find('.offline')

      this.option.find('.options').removeClass('active')

      if (!$target.hasClass('options')) {
        $target = $target.parent()
      }

      const id = $target.attr('id')
      $target.addClass('active')

      if (id === 'all') {
        online.removeClass('hide')
        offline.removeClass('hide')
      } else if (id === 'online') {
        online.removeClass('hide')
        offline.addClass('hide')
      } else if (id === 'offline') {
        offline.removeClass('hide')
        online.addClass('hide')
      }
    }

    getChannelInfo () {
      this.arr.forEach(channel => {
        this.makeAjaxRequest('streams', channel)
        this.makeAjaxRequest('channels', channel)
      })
    }

    makeAjaxRequest (type, name) {
      const url = `${config.BASE_URL}${type}/${name}`
      Utility.ajaxRequest(url)
        .done(this.handleResponse.bind(this, name, type))
        .fail(function (err) {
          console.log('Error: ' + err.status)
        })
    }

    handleResponse (name, type, data) {
      if (!this.obj[name]) {
        this.obj[name] = {}
      }
      this.obj[name][type] = data
      this.count++

      if (this.count === this.arr.length * 2) {
        this.renderResponse()
      }
    }

    renderResponse () {
      for (const key in this.obj) {
        const { streams, channels } = this.obj[key]
        const logo = channels.logo ? `<img src='${channels.logo}' class='logo'/>` : ''
        const game = channels.game ? channels.game : channels.name
        const statusData = channels.status ? channels.status : 'online'

        const status = streams.stream ? 'online' : 'offline'
        const description = status === 'online' ? `${game}:${statusData}` : 'offline'

        const temp = `<li class="list-items ${status}">\
										<div class='image-container'>\
											<div class='image'>${logo}</div>\
											<div class='channel-name'><a href='${channels.url}' target='_blank' class='channel-detail'>${channels.display_name}</a></div>\
										</div>\
										<div class='description'>${description}</div>\
									</li>`
        this.list.append(temp)
      }
    }
  }

  return TwitchTv
})();

(function () {
  new TwitchTv($('.menu'), $('.list-container'))
})()
