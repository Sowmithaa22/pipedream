import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "facebook_groups",
  propDefinitions: {
    group: {
      type: "string",
      label: "Group",
      description: "Identifier of a group",
      async options() {
        const userId = await this.getUserId();
        const opts = {
          userId,
        };
        const { data } = await this.listGroups(opts);
        return data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    post: {
      type: "string",
      label: "Post",
      description: "Identifier of a post",
      async options({ groupId }) {
        const opts = {
          groupId,
        };
        const { data } = await this.listPosts(opts);
        return data?.map(({
          id, message,
        }) => ({
          label: message || id,
          value: id,
        })) || [];
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.facebook.com/v17.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      url,
      path,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async getUserId() {
      const { id } = await this._makeRequest({
        path: "/me",
      });
      return id;
    },
    getPost({
      postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}`,
        ...args,
      });
    },
    listPostComments({
      postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}/comments`,
        ...args,
      });
    },
    listPostReactions({
      postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}/reactions`,
        ...args,
      });
    },
    listGroups({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/${userId}/groups`,
        ...args,
      });
    },
    listPosts({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/feed`,
        ...args,
      });
    },
    createPost({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/feed`,
        method: "POST",
        ...args,
      });
    },
    postPhoto({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/${groupId}/photos`,
        method: "POST",
        ...args,
      });
    },
  },
};
