import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forum, ForumCategory } from './entities/forum.entity';
import { ForumReply } from './entities/forum-reply.entity';
import { CreateForumDto } from './dto/create-forum.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class ForumsService {
      constructor(
            @InjectRepository(Forum)
            private readonly forumRepository: Repository<Forum>,
            @InjectRepository(ForumReply)
            private readonly forumReplyRepository: Repository<ForumReply>,
      ) { }

      async createForum(createForumDto: CreateForumDto, userId: string): Promise<Forum> {
            const forum = this.forumRepository.create({
                  ...createForumDto,
                  user: { id: userId },
            });

            return this.forumRepository.save(forum);
      }

      async findAllForums(
            page: number = 1,
            limit: number = 10,
            category?: ForumCategory,
            search?: string,
      ): Promise<{ forums: Forum[]; total: number }> {
            const queryBuilder = this.forumRepository
                  .createQueryBuilder('forum')
                  .leftJoinAndSelect('forum.user', 'user')
                  .loadRelationCountAndMap('forum.replyCount', 'forum.replies');

            if (category) {
                  queryBuilder.andWhere('forum.category = :category', { category });
            }

            if (search) {
                  queryBuilder.andWhere(
                        '(forum.title ILIKE :search OR forum.content ILIKE :search)',
                        {
                              search: `%${search}%              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="w-5 h-5 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">4.9/5</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Hero Image/Animation */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Campaign Dashboard</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Live</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Summer Campaign</span>
                        <span className="text-sm font-bold text-primary-600">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">152</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Members</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">98%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-primary-500 text-white p-4 rounded-xl shadow-lg animate-bounce-gentle">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-6 h-6" />
                  <span className="font-semibold">Campaign Success!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-4 rounded-xl shadow-lg animate-pulse-glow">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-6 h-6" />
                  <span className="font-semibold">+25 New Members</span>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 animate-bounce-gentle"></div>
              <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50 animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
                <stat.icon className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;